import type { College, CollegeSearchParams } from "../types";

const API_KEY = import.meta.env.VITE_COLLEGE_SCORECARD_API_KEY;
const BASE_URL = "https://api.data.gov/ed/collegescorecard/v1/schools";

if (!API_KEY) {
  throw new Error(
    "Missing College Scorecard API key. Please check your .env file."
  );
}

export interface CollegeScorecardResponse {
  metadata: {
    total: number;
    page: number;
    per_page: number;
  };
  results: CollegeData[];
}

export interface CollegeData {
  id: string;
  school: {
    name: string;
    city: string;
    state: string;
    zip: string;
    school_url: string;
    price_calculator_url: string;
    ownership: number;
    locale: number;
    carnegie_basic: number;
    carnegie_undergrad: number;
    carnegie_size_setting: number;
    degrees_awarded: {
      predominant: string;
      highest: string;
    };
    men_only: boolean;
    women_only: boolean;
    religious_affiliation: string | null;
  };
  latest: {
    student: {
      size: number;
      enrollment: {
        all: number;
        "12_month": number;
        "4_year": number;
        "2_year": number;
        less_than_2_year: number;
      };
      demographics: {
        race_ethnicity: {
          white: number;
          black: number;
          hispanic: number;
          asian: number;
          american_indian_alaska_native: number;
          native_hawaiian_pacific_islander: number;
          two_or_more_races: number;
          unknown: number;
          non_resident_alien: number;
        };
        age_entry: number;
        median_family_income: number;
        income_0_30000: number;
        income_30001_48000: number;
        income_48001_75000: number;
        income_75001_110000: number;
        income_110001_plus: number;
        first_generation: number;
      };
    };
    admissions: {
      admission_rate: {
        overall: number;
        by_ope_id: Record<string, number>;
      };
      sat_scores: {
        "25th_percentile": {
          critical_reading: number;
          math: number;
          writing: number;
        };
        "75th_percentile": {
          critical_reading: number;
          math: number;
          writing: number;
        };
        midpoint: {
          critical_reading: number;
          math: number;
          writing: number;
        };
      };
      act_scores: {
        "25th_percentile": {
          cumulative: number;
          english: number;
          math: number;
          writing: number;
        };
        "75th_percentile": {
          cumulative: number;
          english: number;
          math: number;
          writing: number;
        };
        midpoint: {
          cumulative: number;
          english: number;
          math: number;
          writing: number;
        };
      };
    };
    cost: {
      attendance: {
        academic_year: number;
        "4_year": number;
        "2_year": number;
        program_year: number;
      };
      tuition: {
        in_state: number;
        out_of_state: number;
        program_year: number;
      };
      roomboard: {
        oncampus: number;
        offcampus_not_with_family: number;
        offcampus_with_family: number;
      };
    };
    aid: {
      median_debt: {
        graduating_students: {
          overall: number;
          "4_year": number;
          "2_year": number;
          program_year: number;
        };
        all_students: {
          "4_year": number;
          "2_year": number;
          program_year: number;
        };
      };
      median_debt_graduation_rate: {
        "4_year": number;
        "2_year": number;
        program_year: number;
      };
      median_debt_suppressed: {
        "4_year": number;
        "2_year": number;
        program_year: number;
      };
    };
    repayment: {
      rate_4yr: number;
      rate_lt4: number;
      rate_10yr: number;
    };
  };
}

export interface SearchParams {
  school?: {
    name?: string;
    city?: string;
    state?: string;
  };
  latest?: {
    student?: {
      size?: {
        min?: number;
        max?: number;
      };
    };
    admissions?: {
      admission_rate?: {
        overall?: {
          min?: number;
          max?: number;
        };
      };
    };
    cost?: {
      tuition?: {
        in_state?: {
          min?: number;
          max?: number;
        };
        out_of_state?: {
          min?: number;
          max?: number;
        };
      };
    };
  };
  page?: number;
  per_page?: number;
  fields?: string[];
}

const fieldMapping: { [key: string]: keyof College } = {
  id: "id",
  "school.name": "name",
  "school.city": "city",
  "school.state": "state",
  "school.school_url": "website",
  "latest.admissions.admission_rate.overall": "admission_rate",
  "latest.cost.tuition.in_state": "tuition_in_state",
  "latest.cost.tuition.out_of_state": "tuition_out_state",
  "latest.student.size": "enrollment",
  "latest.admissions.sat_scores.average.overall": "sat_avg",
  "latest.admissions.act_scores.midpoint.cumulative": "act_avg",
};

const fields = Object.keys(fieldMapping).join(",");

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const transformApiResult = (item: any): Partial<College> => {
  const college: Partial<College> = {};
  for (const apiKey in fieldMapping) {
    const modelKey = fieldMapping[apiKey];
    if (item[apiKey] !== null && item[apiKey] !== undefined) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (college as any)[modelKey] = item[apiKey];
    }
  }
  return college;
};

export async function searchColleges(
  params: CollegeSearchParams
): Promise<{ results: Partial<College>[]; total: number }> {
  if (!API_KEY) {
    throw new Error(
      "College Scorecard API key is not configured. Make sure VITE_COLLEGE_SCORECARD_API_KEY is set in your .env file."
    );
  }

  const url = new URL(BASE_URL);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("fields", fields);
  url.searchParams.append("per_page", (params.per_page || 20).toString());
  url.searchParams.append("page", (params.page || 0).toString());

  if (params.query) {
    url.searchParams.append("school.name", params.query);
  }

  // TODO: Add more advanced filters from params.filters

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json();
    console.error("College Scorecard API Error:", errorData);
    throw new Error(
      `Failed to fetch from College Scorecard API: ${response.statusText}`
    );
  }

  const data = await response.json();
  const results = data.results.map(transformApiResult);
  const total = data.metadata.total;

  return { results, total };
}

export async function getCollegeById(
  collegeId: string
): Promise<Partial<College> | null> {
  if (!API_KEY) {
    throw new Error(
      "College Scorecard API key is not configured. Make sure VITE_COLLEGE_SCORECARD_API_KEY is set in your .env file."
    );
  }

  const url = new URL(BASE_URL);
  url.searchParams.append("api_key", API_KEY);
  url.searchParams.append("fields", fields);
  url.searchParams.append("per_page", "1");
  url.searchParams.append("page", "0");
  url.searchParams.append("id", collegeId);

  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorData = await response.json();
    console.error("College Scorecard API Error:", errorData);
    throw new Error(
      `Failed to fetch from College Scorecard API: ${response.statusText}`
    );
  }

  const data = await response.json();

  if (data.results && data.results.length > 0) {
    return transformApiResult(data.results[0]);
  }

  return null;
}
