const submitAssignment = async (assignmentId: string) => {
  try {
    const response = await fetch("/api/student/submit-assignment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ assignmentId }),
    });

    if (!response.ok) {
      throw new Error("Ödev teslim edilirken bir hata oluştu");
    }

    const data = await response.json();
    alert(`Ödev başarıyla teslim edildi! Kazanılan puan: ${data.pointsEarned}`);
    // Ödev listesini güncelle veya sayfayı yenile
  } catch (error) {
    console.error("Ödev teslim hatası:", error);
    alert("Ödev teslim edilirken bir hata oluştu");
  }
};
