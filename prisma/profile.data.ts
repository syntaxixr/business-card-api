import { LinkKind, SkillCategory, SkillLevel } from '@prisma/client';

export interface ProfileData {
  slug: string;
  name: string;
  headline: string;
  description: string;
  location: string | null;
  links: { kind: LinkKind; label: string; url: string }[];
  skills: { name: string; category: SkillCategory; level: SkillLevel }[];
  experience: {
    key: string;
    company: string;
    position: string;
    summary: string | null;
    startedAt: string;
    endedAt: string | null;
    achievements: string[];
  }[];
  projects: {
    name: string;
    description: string;
    url: string;
    repositoryUrl: string | null;
    experience: string | null;
    stack: string[];
  }[];
}

const { LANGUAGE, BACKEND, DATABASE, DEVOPS, FRONTEND } = SkillCategory;
const { BASIC, INTERMEDIATE, ADVANCED } = SkillLevel;

export const profile: ProfileData = {
  slug: 'smokotin',
  name: 'Александр Смокотин',
  headline: 'Backend / Fullstack-разработчик',
  description:
    'Пишу бэкенд на TypeScript и Python, делаю сайты, Telegram-ботов и интеграции. ' +
    'Веду проект целиком: схема базы, API, сервер и деплой.',
  location: 'Томск, работаю удалённо',

  links: [
    { kind: LinkKind.GITHUB, label: 'GitHub', url: 'https://github.com/syntaxixr' },
    { kind: LinkKind.TELEGRAM, label: 'Telegram', url: 'https://t.me/ShadowWild_SS' },
    { kind: LinkKind.WEBSITE, label: 'PRISM', url: 'https://prismdev.ru' },
  ],

  skills: [
    { name: 'TypeScript', category: LANGUAGE, level: ADVANCED },
    { name: 'JavaScript', category: LANGUAGE, level: ADVANCED },
    { name: 'Python', category: LANGUAGE, level: ADVANCED },
    { name: 'PHP', category: LANGUAGE, level: ADVANCED },
    { name: 'C++', category: LANGUAGE, level: INTERMEDIATE },
    { name: 'Kotlin', category: LANGUAGE, level: BASIC },

    { name: 'Node.js', category: BACKEND, level: ADVANCED },
    { name: 'NestJS', category: BACKEND, level: INTERMEDIATE },
    { name: 'GraphQL', category: BACKEND, level: INTERMEDIATE },
    { name: 'Prisma', category: BACKEND, level: INTERMEDIATE },
    { name: 'FastAPI', category: BACKEND, level: ADVANCED },
    { name: 'REST API', category: BACKEND, level: ADVANCED },
    { name: 'Telegram Bot API', category: BACKEND, level: ADVANCED },

    { name: 'PostgreSQL', category: DATABASE, level: INTERMEDIATE },
    { name: 'MySQL', category: DATABASE, level: INTERMEDIATE },
    { name: 'Redis', category: DATABASE, level: INTERMEDIATE },

    { name: 'Docker', category: DEVOPS, level: ADVANCED },
    { name: 'Linux', category: DEVOPS, level: ADVANCED },
    { name: 'Nginx', category: DEVOPS, level: ADVANCED },
    { name: 'Git', category: DEVOPS, level: ADVANCED },
    { name: 'GitHub Actions', category: DEVOPS, level: INTERMEDIATE },

    { name: 'HTML/CSS', category: FRONTEND, level: ADVANCED },
    { name: 'Next.js', category: FRONTEND, level: INTERMEDIATE },
  ],

  experience: [
    {
      key: 'prism',
      company: 'PRISM, своя студия разработки',
      position: 'Fullstack-разработчик',
      summary: 'Делаю сайты, ботов и бэкенд для заказчиков: от требований до работающего сервера.',
      startedAt: '2024-11-01',
      endedAt: null,
      achievements: [
        'Сделал сайт klassgo.ru для томской компании под ключ: дизайн, вёрстка, сборка страниц из данных, сервер и SEO.',
        'Дорабатываю и поддерживаю сайт фильма zhizntemy.ru прямо на рабочем сервере.',
        'Собрал Telegram-бота, который отвечает по документам компании со ссылкой на источник.',
        'Поднял и веду свой VDS: Docker, Nginx, HTTPS, боты и сервисы работают круглосуточно.',
        'Сделал мониторинг промышленного оборудования: данные по MQTT, тревоги приходят в Telegram.',
      ],
    },
  ],

  projects: [
    {
      name: 'КЛАСС! GO',
      description: 'Сайт компании, которая возит школьные классы на экскурсии и мастер-классы.',
      url: 'https://klassgo.ru',
      repositoryUrl: null,
      experience: 'prism',
      stack: ['Python', 'HTML/CSS', 'JavaScript', 'Nginx', 'Linux'],
    },
    {
      name: 'RAG Telegram-бот',
      description: 'Отвечает на вопросы по документам компании и даёт ссылку на источник.',
      url: 'https://github.com/syntaxixr/rag-telegram-bot',
      repositoryUrl: 'https://github.com/syntaxixr/rag-telegram-bot',
      experience: 'prism',
      stack: ['Python', 'Telegram Bot API', 'Docker'],
    },
    {
      name: 'Жизнь Тёмы',
      description: 'Сайт фильма: доработки и поддержка.',
      url: 'https://zhizntemy.ru',
      repositoryUrl: null,
      experience: 'prism',
      stack: ['HTML/CSS', 'JavaScript', 'Nginx'],
    },
    {
      name: 'PRISM',
      description: 'Сайт моей студии.',
      url: 'https://prismdev.ru',
      repositoryUrl: null,
      experience: 'prism',
      stack: ['HTML/CSS', 'JavaScript', 'Python'],
    },
  ],
};
