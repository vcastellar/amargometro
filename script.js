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
    description:
      'Todavía conservas un hilo de humanidad. Te quejas de lo normal, pero sigues siendo el amargado promedio de oficina con margen de rescate.',
  },
  {
    maxRatio: 0.28,
    title: 'Aguafiestas ceñudo',
    description:
      'Tienes la acidez de un yogur caducado. Bufas con elegancia y te incomoda la felicidad ajena, aunque aún logras disimular en reuniones familiares.',
  },
  {
    maxRatio: 0.42,
    title: 'Sommelier de la queja',
    description:
      'Tu deporte favorito es el suspiro de desprecio. Si ves un arcoíris, buscas dónde está la mancha de aceite antes de admitir que es bonito.',
  },
  {
    maxRatio: 0.58,
    title: 'Bilis Premium',
    description:
      'Has hecho de la bilis un arte. No solo estás molesto: diseñas nuevas formas de estarlo y conviertes cualquier comentario alegre en una objeción técnica.',
  },
  {
    maxRatio: 0.74,
    title: 'Sultán de la Mala Leche',
    description:
      'Tu presencia corta la leche a tres metros. Tienes lista negra mental, criterio agrio y una capacidad admirable para arruinar un "qué buen día hace".',
  },
  {
    maxRatio: 0.89,
    title: 'Agujero negro',
    description:
      'Absorbes cualquier rastro de luz o alegría en varios metros a la redonda. El mundo te parece un error de diseño que tú habrías gestionado mejor.',
  },
  {
    maxRatio: 1,
    title: 'General del Mal Fario',
    description:
      'Eres el jefe final de la amargura. No tienes sangre: tienes vinagre de Módena. El Grinch a tu lado parece un monitor de campamento.',
  },
];

const form = document.getElementById('amargometro-form');
const template = document.getElementById('question-template');
const submitButton = document.getElementById('submit-test');
const resetButton = document.getElementById('reset-test');
const meterBar = document.getElementById('meter-bar');
const meterMax = document.getElementById('meter-max');
const scoreValue = document.getElementById('score-value');
const resultTitle = document.getElementById('result-title');
const resultDescription = document.getElementById('result-description');

const totalMaxScore = questions.reduce((sum, question) => sum + question.weight, 0);
meterMax.textContent = totalMaxScore;

questions.forEach((question, index) => {
  const clone = template.content.cloneNode(true);
  const article = clone.querySelector('.question-card');
  const name = `question-${index}`;

  article.dataset.index = String(index);
  article.hidden = index !== 0;

  article.querySelector('.question-tag').textContent = `Pregunta ${index + 1}`;
  article.querySelector('.question-weight').textContent = `Hasta ${question.weight} puntos`;
  article.querySelector('.question-text').textContent = question.text;

  clone.querySelectorAll('input').forEach((input) => {
    input.name = name;
    input.setAttribute('aria-label', `${question.text} - ${input.value}`);
  });

  form.appendChild(clone);
});

const questionCards = [...form.querySelectorAll('.question-card')];

function getSelectedValue(index) {
  return form.querySelector(`input[name="question-${index}"]:checked`)?.value;
}

function updateQuestionStates() {
  let firstUnansweredIndex = questionCards.findIndex((_, index) => !getSelectedValue(index));

  if (firstUnansweredIndex === -1) {
    firstUnansweredIndex = questionCards.length - 1;
  }

  questionCards.forEach((card, index) => {
    const answered = Boolean(getSelectedValue(index));
    const shouldShow = answered || index === 0 || index === firstUnansweredIndex;
    const isCurrent = !answered && index === firstUnansweredIndex;

    card.hidden = !shouldShow;
    card.classList.toggle('is-answered', answered);
    card.classList.toggle('is-current', isCurrent);
  });

  submitButton.disabled = questionCards.some((_, index) => !getSelectedValue(index));
}

function animateValue(targetScore) {
  const duration = 1400;
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

  nextCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function calculateResult() {
  const unanswered = questions.findIndex((_, index) => !getSelectedValue(index));

  if (unanswered !== -1) {
    updateQuestionStates();
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
  const band = resultBands.find((item) => ratio <= item.maxRatio) || resultBands.at(-1);

  meterBar.style.width = `${ratio * 100}%`;
  animateValue(score);
  resultTitle.textContent = band.title;
  resultDescription.textContent = band.description;
  document.querySelector('.result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

form.addEventListener('change', (event) => {
  const target = event.target;

  if (!(target instanceof HTMLInputElement) || target.type !== 'radio') {
    return;
  }

  const [, rawIndex] = target.name.split('-');
  const currentIndex = Number(rawIndex);
  const nextIndex = currentIndex + 1;

  updateQuestionStates();

  if (nextIndex < questions.length) {
    window.setTimeout(() => scrollToQuestion(nextIndex), 150);
  }
});

submitButton.addEventListener('click', calculateResult);

resetButton.addEventListener('click', () => {
  form.reset();
  meterBar.style.width = '0%';
  scoreValue.textContent = '0';
  resultTitle.textContent = 'Responde el test, criatura.';
  resultDescription.textContent = 'Cuando termines, te diremos si eres un rayo de sol o una auditoría con piernas.';
  updateQuestionStates();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

updateQuestionStates();
