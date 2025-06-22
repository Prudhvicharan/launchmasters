import { supabase } from "./supabase";
import type { College, CollegeCategory } from "../types";

/**
 * Caches a college's data in the 'colleges' table.
 * It uses 'upsert' to avoid creating duplicate entries.
 * The API data for a college is partial, so we handle that.
 *
 * @param college - The partial college data from the College Scorecard API.
 * @returns The full college data from our database.
 */
export const upsertCollege = async (college: Partial<College>) => {
  if (!college.id || !college.name) {
    throw new Error("Cannot cache a college without an ID and a name.");
  }

  const collegeDataToUpsert = {
    id: college.id,
    name: college.name,
    city: college.city,
    state: college.state,
    website: college.website,
    admission_rate: college.admission_rate,
    tuition_in_state: college.tuition_in_state,
    tuition_out_state: college.tuition_out_state,
    enrollment: college.enrollment,
    sat_avg: college.sat_avg,
    act_avg: college.act_avg,
  };

  const { data, error } = await supabase
    .from("colleges")
    .upsert(collegeDataToUpsert)
    .select()
    .single();

  if (error) {
    console.error("Error upserting college:", error);
    throw error;
  }

  return data;
};

/**
 * Adds a college to a user's personal list.
 *
 * @param userId - The ID of the user.
 * @param collegeId - The ID of the college to add.
 * @param category - The category to assign ('reach', 'target', 'safety').
 */
export const addCollegeToList = async (
  userId: string,
  collegeId: string,
  category: CollegeCategory
) => {
  const { data, error } = await supabase
    .from("user_colleges")
    .insert({
      user_id: userId,
      college_id: collegeId,
      category: category,
    })
    .select()
    .single();

  if (error) {
    // Handle potential duplicate entries gracefully
    if (error.code === "23505") {
      // Unique constraint violation
      console.warn("User has already saved this college.", error);
      throw new Error(
        "You have already added this college to one of your lists."
      );
    }
    console.error("Error adding college to list:", error);
    throw error;
  }

  return data;
};

/**
 * Fetches the user's saved college list, with full college details.
 *
 * @param userId - The ID of the user whose list to fetch.
 * @returns A promise that resolves to an array of UserCollege objects.
 */
export const getUserCollegeList = async (userId: string) => {
  if (!userId) {
    throw new Error("User ID is required to fetch college list.");
  }

  const { data, error } = await supabase
    .from("user_colleges")
    .select(
      `
      id,
      category,
      notes,
      college:colleges!inner (
        *
      )
    `
    )
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user college list:", error);
    throw error;
  }

  // Handle cases where Supabase returns an array for a joined one-to-one relation
  if (data) {
    return data.map((item: any) => ({
      ...item,
      college: Array.isArray(item.college) ? item.college[0] : item.college,
    }));
  }

  return [];
};

/**
 * Fetches a single college by ID from our database.
 *
 * @param collegeId - The ID of the college to fetch.
 * @returns The college data or null if not found.
 */
export const getCollegeById = async (
  collegeId: string
): Promise<College | null> => {
  if (!collegeId) {
    throw new Error("College ID is required to fetch college details.");
  }

  const { data, error } = await supabase
    .from("colleges")
    .select("*")
    .eq("id", collegeId)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      // No rows returned
      return null;
    }
    console.error("Error fetching college by ID:", error);
    throw error;
  }

  return data;
};
