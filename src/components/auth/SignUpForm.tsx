import { useForm } from "react-hook-form";
import { useState } from "react";
import {
  UserIcon,
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { Toast } from "../ui/Toast";
import { Card } from "../ui/Card";
import type { SignUpFormData } from "../../types";

interface SignUpFormProps {
  onSwitchMode: () => void;
}

export const SignUpForm = ({ onSwitchMode }: SignUpFormProps) => {
  const { signUp } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [requiresConfirmation, setRequiresConfirmation] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "error" } | null>(
    null
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>();

  const password = watch("password");

  // Password strength indicator
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { strength: 0, label: "", variant: "default" as const };
    if (pwd.length < 6)
      return { strength: 25, label: "Too short", variant: "error" as const };
    if (pwd.length < 8)
      return { strength: 50, label: "Weak", variant: "warning" as const };
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(pwd))
      return { strength: 75, label: "Good", variant: "info" as const };
    return { strength: 100, label: "Strong", variant: "success" as const };
  };

  const passwordStrength = getPasswordStrength(password || "");

  const onSubmit = async (data: SignUpFormData) => {
    if (data.password !== data.confirmPassword) {
      setToast({ message: "Passwords don't match", type: "error" });
      return;
    }

    setToast(null);
    const { error, requiresConfirmation: confirmationNeeded } = await signUp(
      data.email,
      data.password,
      data.full_name
    );

    if (error) {
      setToast({ message: error, type: "error" });
    } else if (confirmationNeeded) {
      setRequiresConfirmation(true);
    }
  };

  if (requiresConfirmation) {
    return (
      <Card className="text-center py-8">
        <div className="flex items-center justify-center mb-6">
          <div className="p-3 bg-green-100 rounded-full">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Check your email
        </h3>
        <p className="text-gray-600 mb-6">
          We've sent you a confirmation link. Please check your email and click
          the link to activate your account.
        </p>
        <Button variant="outline" onClick={onSwitchMode}>
          Back to Sign In
        </Button>
      </Card>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Full Name */}
        <Input
          label="Full name"
          type="text"
          icon={<UserIcon className="h-5 w-5" />}
          placeholder="Enter your full name"
          error={errors.full_name?.message}
          {...register("full_name", {
            required: "Full name is required",
            minLength: {
              value: 2,
              message: "Full name must be at least 2 characters",
            },
          })}
        />

        {/* Email */}
        <Input
          label="Email address"
          type="email"
          icon={<EnvelopeIcon className="h-5 w-5" />}
          placeholder="Enter your email"
          error={errors.email?.message}
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Please enter a valid email address",
            },
          })}
        />

        {/* Password */}
        <div className="space-y-2">
          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? "text" : "password"}
              icon={<LockClosedIcon className="h-5 w-5" />}
              placeholder="Create a password"
              error={errors.password?.message}
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5" />
              ) : (
                <EyeIcon className="h-5 w-5" />
              )}
            </button>
          </div>

          {/* Password Strength */}
          {password && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Password strength</span>
                <Badge variant={passwordStrength.variant} size="sm">
                  {passwordStrength.label}
                </Badge>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.variant === "error"
                      ? "bg-red-500"
                      : passwordStrength.variant === "warning"
                      ? "bg-yellow-500"
                      : passwordStrength.variant === "info"
                      ? "bg-blue-500"
                      : "bg-green-500"
                  }`}
                  style={{ width: `${passwordStrength.strength}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <Input
            label="Confirm password"
            type={showConfirmPassword ? "text" : "password"}
            icon={<LockClosedIcon className="h-5 w-5" />}
            placeholder="Confirm your password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword", {
              required: "Please confirm your password",
              validate: (value) =>
                value === password || "Passwords don't match",
            })}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          size="lg"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};
