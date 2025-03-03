import { useState, useEffect } from "react";
import { createSubject } from "../firebase/func/subject";
import { CreateSubject } from "../firebase/interfaces/interface.subject";
import { TextField, Alert } from "@mui/material";

const CreateCourse = () => {
  const [courseName, setCourseName] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Error states
  const [nameError, setNameError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [descriptionError, setDescriptionError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const onSubmit = async () => {
    // Reset errors
    setNameError(null);
    setCodeError(null);
    setDescriptionError(null);

    let hasError = false;

    if (!courseName.trim()) {
      setNameError("Du må skrive inn et kursnavn.");
      hasError = true;
    }

    if (!courseCode.trim()) {
      setCodeError("Du må skrive inn en kurskode.");
      hasError = true;
    }

    if (description.trim().length < 10) {
      setDescriptionError("Beskrivelsen må være på minst 10 tegn.");
      hasError = true;
    }

    if (hasError) return;

    setLoading(true);

    try {
      const newCourse: CreateSubject = {
        name: courseName,
        subject_code: courseCode,
        description,
      };

      await createSubject(newCourse);

      setSuccessMessage("Kurset har blitt opprettet!");
      setCourseName("");
      setCourseCode("");
      setDescription("");
    } catch (error) {
      console.error("Error creating course:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <div style={{ width: "100%", maxWidth: "600px", padding: "20px", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "15px", fontFamily: "sans-serif" }}>Opprett et nytt kurs!</h2>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", fontFamily: "sans-serif" }}>Kursnavn</label>
            <TextField
              type="text"
              value={courseName}
              error={!!nameError}
              helperText={nameError}
              onChange={(e) => setCourseName(e.target.value)}
              fullWidth
              placeholder="Skriv inn kursnavn..."
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", fontFamily: "sans-serif" }}>Kurskode</label>
            <TextField
              type="text"
              value={courseCode}
              error={!!codeError}
              helperText={codeError}
              onChange={(e) => setCourseCode(e.target.value)}
              fullWidth
              placeholder="Skriv inn kurskode (f.eks. TDT4100)..."
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "500", fontFamily: "sans-serif" }}>Beskrivelse</label>
            <TextField
              multiline
              minRows={3}
              value={description}
              error={!!descriptionError}
              helperText={descriptionError}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              placeholder="Skriv en kort beskrivelse av kurset..."
            />
          </div>

          <button
            type="submit"
            onClick={onSubmit}
            disabled={loading}
            style={{ width: "100%", padding: "10px", backgroundColor: "#007BFF", color: "white", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            {loading ? "Oppretter..." : "Opprett kurs"}
          </button>

          {successMessage && <Alert severity="success">{successMessage}</Alert>}
        </form>
      </div>
    </div>
  );
};

export default CreateCourse;
