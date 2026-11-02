// components/add-student-form.tsx
//
// Week 4 Lab — Full implementation covering:
//   • Section 3: Combined useState for form fields
//   • Section 4: FormField JSX rendering
//   • Section 5: Live validation with useEffect
//   • Section 6: Touched state & submitAttempted for smart error visibility
//   • Section 7: Fake async submit with cleanup
//   • Section 8: Submit button + dispatch to context

import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";
import { router } from "expo-router";
import FormField from "./form-field";
import { Student } from "../data/students";
import { useStudents } from "@/context/students-context";

// ─── Types ────────────────────────────────────────────────────────────────────

// Shape of the form's own state.
// Note: skillsText is a single comma-separated string here;
// it gets split into an array only on submit.
interface FormData {
  name: string;
  studentId: string;
  department: string;
  bio: string;
  skillsText: string;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  department?: string;
  bio?: string;
}

// ─── Validation (pure function — easy to test) ────────────────────────────────

function validateForm(data: FormData): FormErrors {
  const newErrors: FormErrors = {};

  // Required field + minimum length
  if (data.name.trim().length === 0) {
    newErrors.name = "Name is required.";
  } else if (data.name.trim().length < 3) {
    newErrors.name = "Name must be at least 3 characters.";
  }

  // Student ID format: NN-NNNNN-N  (e.g. 22-12345-1)
  // ^  — start of string
  // \d{2} — exactly 2 digits
  // -\d{5}- — hyphen, 5 digits, hyphen
  // \d  — exactly 1 digit
  // $  — end of string
  const idPattern = /^\d{2}-\d{5}-\d$/;
  if (data.studentId.trim().length === 0) {
    newErrors.studentId = "Student ID is required.";
  } else if (!idPattern.test(data.studentId.trim())) {
    newErrors.studentId = "Format must be NN-NNNNN-N (e.g. 22-12345-1).";
  }

  if (data.department.trim().length === 0) {
    newErrors.department = "Department is required.";
  }

  if (data.bio.trim().length === 0) {
    newErrors.bio = "Bio is required.";
  } else if (data.bio.trim().length < 10) {
    newErrors.bio = "Bio must be at least 10 characters.";
  }

  // Skills field is optional — no validation rule

  return newErrors;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AddStudentForm() {
  const { dispatch } = useStudents();

  // ── Section 3: Combined state for all 5 text fields ──────────────────────
  // All fields live together so we can pass "the whole form" to validateForm
  // and reset everything in a single setFormData call.
  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    department: "",
    bio: "",
    skillsText: "",
  });

  // Separate state — unrelated to form field values
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Section 6: Touched & submitAttempted state ────────────────────────────
  // touched tracks which fields the user has blurred (tapped away from).
  // submitAttempted reveals all remaining errors when the user presses Submit
  // on fields they never touched.
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // ── Section 7: Submit trigger state ──────────────────────────────────────
  // Boolean flag used purely to trigger the submit useEffect.
  // Keeping it separate from isSubmitting means the effect fires only when
  // the user explicitly presses Submit, not on every isSubmitting toggle.
  const [submitTrigger, setSubmitTrigger] = useState(false);

  // ── Generic field updater ─────────────────────────────────────────────────
  // keyof FormData = 'name' | 'studentId' | 'department' | 'bio' | 'skillsText'
  // This one function handles all 5 fields; passing an invalid key is a TS error.
  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ── Section 6 helpers ─────────────────────────────────────────────────────
  const markTouched = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // A field's error is visible only if the user has blurred it (touched)
  // OR has attempted to submit the form.
  const getFieldError = (field: keyof FormErrors) => {
    return touched[field] || submitAttempted ? errors[field] : undefined;
  };

  // ── Section 5: Live validation useEffect ─────────────────────────────────
  // Dependency array [formData]: re-run every time any field changes.
  // Using [] would run only once (errors never update while typing).
  // No array would run on every render, including unrelated state changes.
  useEffect(() => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
  }, [formData]);

  // Derived value — computed fresh every render, not stored in state.
  // Object.keys(errors).length === 0 means all validations passed.
  // The extra non-empty checks guard against the initial blank-form render.
  const isFormValid =
    Object.keys(errors).length === 0 &&
    formData.name.length > 0 &&
    formData.studentId.length > 0;

  // ── Section 7: Fake async submit useEffect with cleanup ──────────────────
  // Runs only when submitTrigger flips to true.
  // The cleanup function cancels the timeout if the user navigates away
  // before the 1.5 s delay finishes — prevents "state update on unmounted
  // component" warnings and duplicate submissions.
  useEffect(() => {
    if (!submitTrigger) return;

    const timeoutId = setTimeout(() => {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department.trim(),
        bio: formData.bio.trim(),
        skills: formData.skillsText
          .split(",")
          .map((s) => s.trim())
          .filter((s) => s.length > 0),
        avatarUrl: "https://i.pravatar.cc/150?u=" + Date.now(),
      };

      // Lift state up — dispatch ADD_STUDENT so the directory list updates
      dispatch({ type: "ADD_STUDENT", payload: newStudent });

      setIsSubmitting(false);
      setSubmitTrigger(false);
      router.back();
    }, 1500);

    // Cleanup: cancel the timeout when the component unmounts
    return () => {
      clearTimeout(timeoutId);
    };
  }, [submitTrigger]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Section 6.4 / Section 8: Submit press handler ────────────────────────
  const handleSubmitPress = () => {
    // Mark every field as touched so all pending errors become visible at once.
    // This handles the case where the user skips a field and goes straight to Submit.
    setTouched({
      name: true,
      studentId: true,
      department: true,
      bio: true,
    });
    setSubmitAttempted(true);

    if (isFormValid) {
      setIsSubmitting(true);
      setSubmitTrigger(true);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Join the Directory</Text>
      <Text style={styles.subheading}>
        Fill in your details below to add yourself to StudentDirectory.
      </Text>

      {/* Section 4 + Section 6.3 — each field passes onBlur and getFieldError */}

      <FormField
        label="Full Name"
        value={formData.name}
        onChangeText={(text) => updateField("name", text)}
        onBlur={() => markTouched("name")}
        placeholder="e.g. Ashraful Haque"
        error={getFieldError("name")}
      />

      <FormField
        label="Student ID"
        value={formData.studentId}
        onChangeText={(text) => updateField("studentId", text)}
        onBlur={() => markTouched("studentId")}
        placeholder="e.g. 22-12345-1"
        autoCapitalize="none"
        error={getFieldError("studentId")}
      />

      <FormField
        label="Department"
        value={formData.department}
        onChangeText={(text) => updateField("department", text)}
        onBlur={() => markTouched("department")}
        placeholder="e.g. Computer Science"
        error={getFieldError("department")}
      />

      <FormField
        label="Bio"
        value={formData.bio}
        onChangeText={(text) => updateField("bio", text)}
        onBlur={() => markTouched("bio")}
        placeholder="A short sentence about yourself..."
        multiline
        error={getFieldError("bio")}
      />

      {/* Skills has no error prop — it is optional, nothing to validate */}
      <FormField
        label="Skills (comma-separated)"
        value={formData.skillsText}
        onChangeText={(text) => updateField("skillsText", text)}
        onBlur={() => markTouched("skillsText")}
        placeholder="e.g. React Native, TypeScript, Figma"
        autoCapitalize="none"
      />

      {/* Section 8: Submit button — disabled while form is invalid or submitting */}
      <Pressable
        style={[styles.button, !isFormValid && styles.buttonDisabled]}
        onPress={handleSubmitPress}
        disabled={!isFormValid || isSubmitting}
      >
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Join Directory</Text>
        )}
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={isSubmitting}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0D1F4E",
    marginBottom: 4,
  },
  subheading: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 24,
    lineHeight: 19,
  },
  button: {
    backgroundColor: "#0D9488",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  buttonDisabled: {
    backgroundColor: "#CBD5E1",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
  cancelButton: {
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 32,
  },
  cancelButtonText: {
    color: "#64748B",
    fontSize: 14,
    fontWeight: "600",
  },
});
