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

  function validateStep(stepIndex) {
    const step = steps[stepIndex];
    const inputs = step.querySelectorAll('input[required]');
    let isValid = true;
    let firstInvalid = null;

    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('error');
        if (!firstInvalid) firstInvalid = input;
      } else {
        input.classList.remove('error');
      }
    });

    if (!isValid) {
      notify("Campos obrigatórios", "Por favor, preencha todos os campos obrigatórios antes de prosseguir.", "error", "center");
      if (firstInvalid) firstInvalid.focus();
    }

    return isValid;
  }

  document.querySelectorAll(".next").forEach((button) => {
    button.addEventListener("click", () => {
      if (validateStep(currentStep)) {
        if (currentStep < steps.length - 1) {
          currentStep++;
          showStep(currentStep);
        }
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
