const questions = [
  {
    text: '¿Escuchas una canción de moda en la radio sin decir que "la música de antes sí que valía la pena"?',
    weight: 5,
  },
  {
    text: 'Si un niño te saluda por la calle, ¿le sonríes en lugar de mirar el móvil con intensidad?',
    weight: 6,
  },
  {
    text: '¿Eres capaz de entrar a un grupo de WhatsApp y ver un sticker de "Feliz Jueves" sin que te suba la tensión?',
    weight: 7,
  },
  {
    text: '¿Ves un video de un perrito tierno sin pensar en la cantidad de pelos que debe soltar en el sofá?',
    weight: 5,
  },
  {
    text: '¿Crees que el lunes es simplemente un día más y no un ataque personal del universo contra ti?',
    weight: 7,
  },
  {
    text: '¿Puedes ir al supermercado un sábado por la tarde sin desear que un rayo desintegre a la gente que camina lento?',
    weight: 8,
  },
  {
    text: 'Si un amigo te cuenta un proyecto con ilusión, ¿evitas listarle inmediatamente los 10 motivos por los que va a fracasar?',
    weight: 8,
  },
  {
    text: '¿Crees que hoy puede ser un gran día aunque no te haya tocado la lotería?',
    weight: 6,
  },
  {
    text: 'Alguien te dice "¡Buenos días!" con alegría un lunes a las 8:00 AM. ¿Consigues no desearle una desgracia personal inmediata?',
    weight: 9,
  },
  {
    text: '¿Eres capaz de ver a una pareja de enamorados en el parque sin calcular mentalmente cuánto tardarán en engañarse el uno al otro?',
    weight: 7,
  },
  {
    text: '¿Puedes escuchar el éxito de reggaetón del verano sin dar un discurso no solicitado sobre la muerte de la cultura occidental?',
    weight: 7,
  },
  {
    text: 'Si un niño te sonríe en el transporte público, ¿le devuelves el gesto en lugar de mirar al infinito con cara de "por qué no se callará"?',
    weight: 6,
  },
  {
    text: '¿Puedes ver un mensaje de "Feliz Jueves" con un gatito en el grupo de la familia sin sentir un impulso violento de abandonar el chat?',
    weight: 8,
  },
  {
    text: '¿Ves un vídeo de un cachorro y piensas en su ternura antes que en el olor a perro mojado y las facturas del veterinario?',
    weight: 5,
  },
  {
    text: '¿Eres capaz de admitir que hace un día bonito sin añadir un: "bueno, pero mañana seguro que refresca"?',
    weight: 6,
  },
  {
    text: 'En el supermercado, ¿puedes esperar tu turno sin mirar la nuca del que va delante como si quisieras hacerle explotar la cabeza con la mente?',
    weight: 8,
  },
  {
    text: 'Si un amigo te cuenta un proyecto con ilusión, ¿te guardas tu "realismo tóxico" y no le hundes la moral en los primeros cinco minutos?',
    weight: 8,
  },
  {
    text: '¿Crees que es posible que te pase algo bueno hoy sin que sea una trampa del destino para fastidiarte mañana?',
    weight: 9,
  },
];

const scoreMap = {
  sí: 0,
  a_veces: 0.55,
  no: 1,
};

const resultBands = [
  {
    maxRatio: 0.14,
    title: 'Alérgico a la sonrisa',
    category: 'Amargura leve con esperanza',
    description:
      'Todavía conservas un hilo de humanidad. Te quejas de lo normal, pero sigues siendo el amargado promedio de oficina con margen de rescate.',
  },
  {
    maxRatio: 0.28,
    title: 'Aguafiestas ceñudo',
    category: 'Amargura funcional',
    description:
      'Tienes la acidez de un yogur caducado. Bufas con elegancia y te incomoda la felicidad ajena, aunque aún logras disimular en reuniones familiares.',
  },
  {
    maxRatio: 0.42,
    title: 'Sommelier de la queja',
    category: 'Amargura entrenada',
    description:
      'Tu deporte favorito es el suspiro de desprecio. Si ves un arcoíris, buscas dónde está la mancha de aceite antes de admitir que es bonito.',
  },
  {
    maxRatio: 0.58,
    title: 'Bilis Premium',
    category: 'Amargura seria',
    description:
      'Has hecho de la bilis un arte. No solo estás molesto: diseñas nuevas formas de estarlo y conviertes cualquier comentario alegre en una objeción técnica.',
  },
  {
    maxRatio: 0.74,
    title: 'Sultán de la Mala Leche',
    category: 'Amargura avanzada',
    description:
      'Tu presencia corta la leche a tres metros. Tienes lista negra mental, criterio agrio y una capacidad admirable para arruinar un “qué buen día hace”.',
  },
  {
    maxRatio: 0.89,
    title: 'Agujero negro',
    category: 'Amargura extrema',
    description:
      'Absorbes cualquier rastro de luz o alegría en varios metros a la redonda. El mundo te parece un error de diseño que tú habrías gestionado mejor.',
  },
  {
    maxRatio: 1,
    title: 'General del Mal Fario',
    category: 'Jefe final de la amargura',
    description:
      'Eres el jefe final de la amargura. No tienes sangre: tienes vinagre de Módena. El Grinch a tu lado parece un monitor de campamento.',
  },
];

const form = document.getElementById('amargometro-form');
const template = document.getElementById('question-template');
const startButton = document.getElementById('start-test');
const submitButton = document.getElementById('submit-test');
const resetButton = document.getElementById('reset-test');
const meterBar = document.getElementById('meter-bar');
const meterMax = document.getElementById('meter-max');
const scoreValue = document.getElementById('score-value');
const resultTitle = document.getElementById('result-title');
const resultDescription = document.getElementById('result-description');
const resultCategoryName = document.getElementById('result-category-name');
const quizStatus = document.getElementById('quiz-status');
const deviceHint = document.getElementById('device-hint');
const root = document.documentElement;

const totalMaxScore = questions.reduce((sum, question) => sum + question.weight, 0);
meterMax.textContent = totalMaxScore;

let currentDeviceProfile = 'desktop';

questions.forEach((question, index) => {
  const clone = template.content.cloneNode(true);
  const article = clone.querySelector('.question-card');
  const name = `question-${index}`;

  article.dataset.index = String(index);
  article.hidden = false;

  article.querySelector('.question-tag').textContent = `Pregunta ${index + 1}`;
  article.querySelector('.question-text').textContent = question.text;

  clone.querySelectorAll('input').forEach((input) => {
    input.name = name;
    input.setAttribute('aria-label', `${question.text} - ${input.value}`);
  });

  form.appendChild(clone);
});

const questionCards = [...form.querySelectorAll('.question-card')];
const lastResultBand = resultBands[resultBands.length - 1];

function getSelectedValue(index) {
  return form.querySelector(`input[name="question-${index}"]:checked`)?.value;
}

function detectDeviceProfile() {
  const hasTouch = window.matchMedia('(pointer: coarse)').matches || navigator.maxTouchPoints > 0;
  const isNarrowViewport = window.matchMedia('(max-width: 760px)').matches;
  return hasTouch || isNarrowViewport ? 'mobile' : 'desktop';
}

function applyDeviceProfile() {
  currentDeviceProfile = detectDeviceProfile();
  root.dataset.device = currentDeviceProfile;

  if (deviceHint) {
    deviceHint.textContent =
      currentDeviceProfile === 'mobile'
        ? 'Modo smartphone: botones más grandes y menos animaciones para responder con el pulgar.'
        : 'Modo PC: vista optimizada para leer rápido y calcular tu drama sin estorbar.';
  }

  if (submitButton) {
    submitButton.textContent =
      currentDeviceProfile === 'mobile' ? 'Calcular puntuación' : 'Calcular mi puntuación amarga';
  }
}

function updateQuestionStates() {
  const firstUnansweredIndex = questionCards.findIndex((_, index) => !getSelectedValue(index));
  const answeredCount = questionCards.filter((_, index) => Boolean(getSelectedValue(index))).length;
  const isComplete = firstUnansweredIndex === -1;

  questionCards.forEach((card, index) => {
    const answered = Boolean(getSelectedValue(index));
    const isCurrent = !isComplete && index === firstUnansweredIndex;

    card.hidden = false;
    card.classList.toggle('is-answered', answered);
    card.classList.toggle('is-current', isCurrent);
  });

  submitButton.disabled = !isComplete;

  if (quizStatus) {
    quizStatus.hidden = false;
    quizStatus.innerHTML = isComplete
      ? '<strong>Listo.</strong> Ya puedes pulsar el botón para calcular tu puntuación y ver tu categoría de amargura.'
      : `<strong>Progreso:</strong> llevas ${answeredCount} de ${questions.length} respuestas. Completa todas antes de pulsar calcular.`;
  }
}

function animateValue(targetScore) {
  const duration = currentDeviceProfile === 'mobile' ? 900 : 1400;
  const start = performance.now();
  const initialValue = Number(scoreValue.textContent) || 0;

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(initialValue + (targetScore - initialValue) * eased);
    scoreValue.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function scrollToQuestion(index) {
  const nextCard = questionCards[index];

  if (!nextCard) {
    return;
  }

  nextCard.scrollIntoView({
    behavior: currentDeviceProfile === 'mobile' ? 'auto' : 'smooth',
    block: 'start',
  });
}

function calculateResult() {
  const unanswered = questions.findIndex((_, index) => !getSelectedValue(index));

  if (unanswered !== -1) {
    updateQuestionStates();
    resultCategoryName.textContent = 'Diagnóstico bloqueado';
    resultTitle.textContent = 'Te has dejado preguntas sin responder, alma de cántaro.';
    resultDescription.textContent = `Completa la pregunta ${unanswered + 1} para que podamos juzgarte con datos y no solo por intuición.`;
    scrollToQuestion(unanswered);
    return;
  }

  let score = 0;

  questions.forEach((question, index) => {
    const value = getSelectedValue(index);
    score += Math.round(question.weight * scoreMap[value]);
  });

  const ratio = score / totalMaxScore;
  const band = resultBands.find((item) => ratio <= item.maxRatio) || lastResultBand;

  meterBar.style.width = `${ratio * 100}%`;
  animateValue(score);
  resultCategoryName.textContent = band.category;
  resultTitle.textContent = band.title;
  resultDescription.textContent = band.description;
  document.querySelector('.result').scrollIntoView({
    behavior: currentDeviceProfile === 'mobile' ? 'auto' : 'smooth',
    block: 'start',
  });
}

form.addEventListener('change', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.type !== 'radio') {
    return;
  }

  updateQuestionStates();
});

startButton?.addEventListener('click', () => {
  scrollToQuestion(0);
  form.querySelector('input')?.focus({ preventScroll: true });
});

submitButton.addEventListener('click', calculateResult);

resetButton.addEventListener('click', () => {
  form.reset();
  meterBar.style.width = '0%';
  scoreValue.textContent = '0';
  resultCategoryName.textContent = 'Pendiente de diagnóstico';
  resultTitle.textContent = 'Responde el test, criatura.';
  resultDescription.textContent = 'Cuando termines, te diremos si eres un rayo de sol o una auditoría con piernas.';
  updateQuestionStates();
  window.scrollTo({ top: 0, behavior: currentDeviceProfile === 'mobile' ? 'auto' : 'smooth' });
});

applyDeviceProfile();
updateQuestionStates();
window.addEventListener('resize', applyDeviceProfile, { passive: true });
