import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../hooks/useAuth";
import { getInitials } from "../../utils";
<<<<<<< HEAD
import type { User } from "../../types";
=======
>>>>>>> main

interface UserProfileFormData {
  full_name: string;
  email: string;
}

export function UserProfile() {
  const { user, updateProfile, loading, error } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserProfileFormData>({
    defaultValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
    },
  });

  const onSubmit = async (data: UserProfileFormData) => {
    const result = await updateProfile({
      full_name: data.full_name,
    });

    if (!result.error) {
      setUpdateSuccess(true);
      setIsEditing(false);
      setTimeout(() => setUpdateSuccess(false), 3000);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    reset({
      full_name: user?.full_name || "",
      email: user?.email || "",
    });
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset();
  };

  if (!user) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <p className="text-gray-600">Loading user profile...</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
        {!isEditing && (
          <button onClick={handleEdit} className="btn-secondary text-sm">
            Edit Profile
          </button>
        )}
      </div>

      {updateSuccess && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">
                Profile updated successfully
              </h3>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Update failed
              </h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-shrink-0">
          {user.avatar_url ? (
            <img
              className="h-16 w-16 rounded-full"
              src={user.avatar_url}
              alt={user.full_name || "User avatar"}
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-primary-600 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">
                {getInitials(user.full_name || user.email)}
              </span>
            </div>
          )}
        </div>
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            {user.full_name || "No name set"}
          </h3>
          <p className="text-gray-600">{user.email}</p>
        </div>
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label
              htmlFor="full_name"
              className="block text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              id="full_name"
              type="text"
              className={`mt-1 input-field ${
                errors.full_name
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                  : ""
              }`}
              placeholder="Enter your full name"
              {...register("full_name", {
                required: "Full name is required",
                minLength: {
                  value: 2,
                  message: "Full name must be at least 2 characters",
                },
              })}
            />
            {errors.full_name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.full_name.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              disabled
              className="mt-1 input-field bg-gray-50 cursor-not-allowed"
              value={user.email}
            />
            <p className="mt-1 text-sm text-gray-500">
              Email address cannot be changed
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save Changes"}
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="btn-secondary"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {user.full_name || "No name set"}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <p className="mt-1 text-sm text-gray-900">{user.email}</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Member Since
            </label>
            <p className="mt-1 text-sm text-gray-900">
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
