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
    maxRatio: 0.2,
    title: 'Nivel: persona soportable por la sociedad.',
    description:
      'Sorprendentemente no destilas bilis por los poros. Quizá seas amable o quizá aún no te ha llegado el recibo de la luz.',
  },
  {
    maxRatio: 0.4,
    title: 'Nivel: ceño fruncido de uso doméstico.',
    description:
      'Tienes tus cositas, tus bufidos y tus juicios gratuitos, pero todavía puedes pasar por funcional sin asustar a Recursos Humanos.',
  },
  {
    maxRatio: 0.65,
    title: 'Nivel: vinagre reserva.',
    description:
      'La gente siente tu energía agria antes de que abras la boca. Aun así, podrías reconducirte si dejas de discutir con stickers de gatitos.',
  },
  {
    maxRatio: 0.85,
    title: 'Nivel: señor/a de la tormenta permanente.',
    description:
      'Lo tuyo no es mal humor: es una marca personal. Si un arcoíris sale delante de ti, seguramente lo denuncias por exceso de optimismo.',
  },
  {
    maxRatio: 1,
    title: 'Nivel: leyenda negra del amargor.',
    description:
      'Enhorabuena, criatura. No tienes sangre, tienes café recalentado y rencor elegante. Eres el motivo por el que el amargómetro necesitaba barra XL.',
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

  article.querySelector('.question-tag').textContent = `Pregunta ${index + 1}`;
  article.querySelector('.question-weight').textContent = `Hasta ${question.weight} puntos`;
  article.querySelector('.question-text').textContent = question.text;

  clone.querySelectorAll('input').forEach((input) => {
    input.name = name;
    input.setAttribute('aria-label', `${question.text} - ${input.value}`);
  });

  form.appendChild(clone);
});

function getSelectedValue(index) {
  return form.querySelector(`input[name="question-${index}"]:checked`)?.value;
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

function calculateResult() {
  const unanswered = questions.findIndex((_, index) => !getSelectedValue(index));

  if (unanswered !== -1) {
    resultTitle.textContent = 'Te has dejado preguntas sin responder, alma de cántaro.';
    resultDescription.textContent = `Completa la pregunta ${unanswered + 1} para que podamos juzgarte con datos y no solo por intuición.`;
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
}

submitButton.addEventListener('click', calculateResult);

resetButton.addEventListener('click', () => {
  form.reset();
  meterBar.style.width = '0%';
  scoreValue.textContent = '0';
  resultTitle.textContent = 'Responde el test, criatura.';
  resultDescription.textContent = 'Cuando termines, te diremos si eres un rayo de sol o una auditoría con piernas.';
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
