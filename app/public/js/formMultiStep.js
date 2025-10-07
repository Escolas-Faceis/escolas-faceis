document.addEventListener("DOMContentLoaded", () => {
  const steps = document.querySelectorAll(".step");
  let currentStep = 0;

  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
    });
    updateProgress(stepIndex);
  }

  function updateProgress(stepIndex) {
    const progressFill = document.querySelector('.progress-fill');
    const totalSteps = steps.length;
    const progressWidth = ((stepIndex + 1) / totalSteps) * 100;

    if (progressFill) {
      progressFill.style.width = `${progressWidth}%`;
    }
  }

  document.querySelectorAll(".next").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    });
  });

  document.querySelectorAll(".prev").forEach((button) => {
    button.addEventListener("click", () => {
      if (currentStep > 0) {
        currentStep--;
        showStep(currentStep);
      }
    });
  });

  showStep(currentStep);
});
