import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../hooks/useAuth";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import type { DeadlineType } from "../../types";

interface CollegeListItem {
  id: string;
  category: string;
  college?: {
    id: string;
    name: string;
  };
}

interface AddDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  collegeList: CollegeListItem[];
}

export function AddDeadlineModal({
  isOpen,
  onClose,
  collegeList,
}: AddDeadlineModalProps) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({
    college_id: "",
    deadline_type: "regular_decision" as DeadlineType,
    deadline_date: "",
    notes: "",
  });

  const addDeadlineMutation = useMutation({
    mutationFn: async () => {
      // TODO: Implement actual deadline creation
      console.log("Adding deadline:", formData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["deadlines"] });
      onClose();
      setFormData({
        college_id: "",
        deadline_type: "regular_decision",
        deadline_date: "",
        notes: "",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.college_id || !formData.deadline_date) return;
    addDeadlineMutation.mutate();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case "reach":
        return "error";
      case "target":
        return "warning";
      case "safety":
        return "success";
      default:
        return "default";
    }
  };

  const getDeadlineTypeLabel = (type: DeadlineType) => {
    switch (type) {
      case "early_decision":
        return "Early Decision (ED)";
      case "early_action":
        return "Early Action (EA)";
      case "regular_decision":
        return "Regular Decision (RD)";
      case "rolling":
        return "Rolling Admission";
      default:
        return type;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Application Deadline"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* College Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select College
          </label>
          {collegeList.length > 0 ? (
            <select
              value={formData.college_id}
              onChange={(e) => handleInputChange("college_id", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            >
              <option value="">Choose a college from your list...</option>
              {collegeList.map((item) => (
                <option key={item.id} value={item.college?.id || ""}>
                  {item.college?.name || "Unknown College"}
                </option>
              ))}
            </select>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No colleges in your list yet.</p>
              <p className="text-sm">
                Add some colleges first to create deadlines.
              </p>
            </div>
          )}
        </div>

        {/* Show selected college info */}
        {formData.college_id && (
          <div className="p-3 bg-gray-50 rounded-lg">
            {(() => {
              const selectedCollege = collegeList.find(
                (item) => item.college?.id === formData.college_id
              );
              return selectedCollege ? (
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">
                    {selectedCollege.college?.name}
                  </span>
                  <Badge
                    variant={getCategoryBadgeVariant(selectedCollege.category)}
                    size="sm"
                  >
                    {selectedCollege.category}
                  </Badge>
                </div>
              ) : null;
            })()}
          </div>
        )}

        {/* Deadline Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline Type
          </label>
          <div className="space-y-2">
            {(
              [
                "early_decision",
                "early_action",
                "regular_decision",
                "rolling",
              ] as DeadlineType[]
            ).map((type) => (
              <label key={type} className="flex items-center">
                <input
                  type="radio"
                  name="deadline_type"
                  value={type}
                  checked={formData.deadline_type === type}
                  onChange={(e) =>
                    handleInputChange("deadline_type", e.target.value)
                  }
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                />
                <span className="ml-3 text-sm text-gray-700">
                  {getDeadlineTypeLabel(type)}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Deadline Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deadline Date
          </label>
          <input
            type="date"
            value={formData.deadline_date}
            onChange={(e) => handleInputChange("deadline_date", e.target.value)}
            min={new Date().toISOString().split("T")[0]} // Prevent past dates
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notes (Optional)
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Add any additional notes about this deadline..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              addDeadlineMutation.isPending ||
              !formData.college_id ||
              !formData.deadline_date ||
              collegeList.length === 0
            }
          >
            {addDeadlineMutation.isPending ? "Adding..." : "Add Deadline"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
