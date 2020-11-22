import React from 'react';
import {
  ShortText,
  DoneAll,
  Highlight,
  Work,
  History as HistoryIcon,
  Alarm,
  School,
} from '@material-ui/icons';

import { Menu } from './interfaces/menu.interface';
import { History } from './interfaces/history.interface';
import List from './components/content/List'
import HistoryComponent from './components/content/History';
import SkillsTable from './components/content/SkillsTable';

const MenuItems: Menu[] = [
  {
    title: 'Summary',
    content: [
      `A full stack software developer and business analyst, with a career in providing solution-driven software in the field of finance, accounting, insurance and large scale networks. Developed applications across programming languages and application layers to create integrated solutions with graphical and web user interfaces. Professional experience writing Node.js web applications driven by relational databases running in both a container and cloud environment. Proficient in web development technologies JavaScript (ECMAScript 6+), HTML, CSS, JSON and XML. Engineered web frontend applications using frameworks including Handlebars, React i.e. Ionic. Engaged in Agile development and associated methodologies such as Kanban, Scrum and Sprints. Key strengths include high internal motivation and attention to detail. Managing pressures created by demands of clients and limitations on resources through prioritization and relationship management. Working within teams to lead, motivate and develop efficiently. Key skills include designing business applications across multiple languages, creating web services and RESTful API’s, converting applications into both client and developer documentation and working with large complex databases using SQL to perform CRUD operations.`,
    ],
    component: (content: string[]): JSX.Element => <List paragraphs={content} />,
    icon: <ShortText />,
  },
  {
    title: 'Skills and Experience',
    content: [
      'Business process analysis and UML design for documenting requirements, use and test cases.',
      'Building and deploying applications with Docker and AWS EC2 containers. ',
      'Relational Databases Design: MySQL, Postgres and Oracle.',
      'Working in a dynamic team environment and managing communication flow.',
      'Writing backend applications with Node.js, Java, C# and Python.',
      'Writing Web applications in HTML 5, CSS 3, Bootstrap 4, JavaScript, JQuery, Node.js, AJAX.',
      'Writing web APIs using REST and GraphQL.',
      'Integrating applications and external systems into applications.',
      'AWS serverless application design and deployment using Serverless application model.',
      'Using communication tools to improve information and knowledge flow.',
      'Collaborating on new architecture for business applications.',
      'Writing scripts for Windows and Unix OS environments.',
      'Agile techniques: SCRUM, SPRINT and KANBAN.',
      'Working in high-pressure and time-sensitive environments.',
      'Knowledge of both hardware, software and networks.',
      'Building secure applications using public-private key encryption, hashing and JWT’s.',
      'Involved in leadership while in high school, college and in the workplace.',
      'Version control with Git and CVS.',
      'Comprehensive analysis of organizational dynamics and social structures.',
      'Exposure to UNIX (Ubuntu, Mac OS and CentOS) as well as Windows.',
      'Test driven development with regression testing and unit testing using Jest',
      'Understanding financial tools to make business decisions.',
      'Using build dependency management tools such as npm and yarn.',
      'Writing VBA macros to automate business processes.',
    ],
    component: (content: string[]): JSX.Element => <SkillsTable skills={content} />,
    icon: <DoneAll />,
  },
  {
    title: 'Career',
    icon: <Work />,
    subMenus: [
      {
        title: 'Highlights',
        content: [
          `In 2019 our team was selected to be part of a cross organizational effort to abstract our On premises cloud infrastructure. By designing an application that would provision virtual machines to facilitate our advanced research computing department effort to make big data analysis easier. A Sprint team was organized and I was set to develop the frontend component of the system. The team formed quickly and was able to conclude the project well ahead of schedule. We were also faced with the challenge of a change of scope midway through the project. This resulted in me being heavily involved in working with backend provisioning systems that were well outside of my scope. This allowed me to engage in skills such as OpenStack resource provisioning using Ansible and Ansible Tower. The project was successful and we were able to deliver two systems which had been promised for several years.`,
          `In 2015 my team had increased pressure to go live and sell our accounting package to generate income for our division. This was causing unrest in the office – one of the chief complaints was the lack of a sandbox server for new ideas and testing. This had been an issue for over six years, but due to rapid growth, the issue had been put on hold. I was nominated and placed as a member of an office committee charged with bringing complaints to management. This was done in order to create a compromise with the executive committee responsible for the organization’s budgets. Several coworkers approached me in order to push this point. I was initially met with resistance by management and essentially was told not to push the matter further. I approached my coworkers and suggested we draw up a fact sheet detailing the cost benefit. At our meeting I presented our findings and two months after the first meeting the server was purchased and installed.`,
        ],
        component: (content: string[]) => <List paragraphs={content} />,
        icon: <Highlight />,
      },
      {
        title: 'History',
        content: [
          {
            employer:
              'Current Employer: Virginia Tech – Software Development, NI&S, Department of IT',
            position: 'Position: Software Developer',
            dates: 'Dates: December 2017 – Present',
            description:
              'NI&S is a division within the Department of IT that provides networking and network infrastructure services to Virginia Tech',
            summary: [
              'In my most recent role I have been involved writing Node.js applications to manage network infrastructure and super computing units.',
              'I have used several frameworks such as bootstrap, handlebars.js, Express.js. React.js and Ionic.',
              'Used docker containers to build and deploy applications and API’s.',
              'Been a part of a team that uses the Kanban methodology to organize, prioritize, and track tasks, projects and units of work.',
            ],
            keyAchievements: [
              'Since taking my position at Virginia Tech, I feel, I have fit into a dynamic and well-organized team of individuals. With the small size and proximity of the team, I have been able to rapidly learn from my co-workers and enabled me to touch several high priority projects. This has enabled me to build multiple applications and make key design decisions with a high degree of self organization. This position has allowed me to grow without hindrance and learn new technologies. Designing and writing a cloud computing  provisioning web application has been the most enjoyable project of my career.',
            ],
          },
          {
            employer: 'Employer: Self Employed – Galvanized Solutions',
            position: 'Position: Owner and Software Developer',
            dates: 'Dates: March 2017 – December 2017',
            description:
              'A software development company specializing in creating human information systems that bolster corporate communication, specifically addressing the human element of an organization.',
            summary: [
              'In my time in the United States I was able to reflect on my career experience and  working on projects I did not have the time to start while I was employed full-time in South Africa.',
              'I was able to focus all my energy into learning and aligning myself with my interests.',
            ],
          },
        ],
        component: (content: History[]): JSX.Element => <HistoryComponent history={content} />,
        icon: <HistoryIcon />,
      },
      {
        title: 'Early Career',
        icon: <Alarm />,
        content: [
          {
            employer: 'Employer: MIP Holdings',
            position: 'Position: Junior Software Developer',
            dates: 'Dates: February 2015 – July 2017',
            description:
              'A financial information systems development company, with one of the biggest client bases on the African continent. Specializing in insurance and financial organizations.',
            summary: [
              'In 2014 I was selected to be trained to take over the development of an in-house web UI accounting package that was being pushed for live release.',
              'The goal was to be able to assist the currently over-committed senior developer with the plan of succession. ',
              'I attended a 3-month training program and was certified as an OpenEdge Progress 4GL software developer.',
              'We were, at that time, using Waterfall methodology and transitioned to Agile methodology over a 6-month period.',
            ],
            keyAchievements: [
              'One of our major clients wanted to implement a mobile payment solution using a mobile application and a back-end service API. The API had several security design concerns, as it was a direct connection with bank servers. We wrote an algorithm to encrypt and create a security token. We integrated the algorithm into a service designed to communicate with the payment device via a payment gateway. The payment had to then be processed using a REST service and logged using an event trigger. The documentation provided was vague, and the examples had to be reverse engineered into the language we were using. The deadline was over Christmas and into the New Year, and we hit several stumbling blocks as many of the support staff were on leave over the holidays. I was able to write the service and documentation to release in time for our mobile applications team to create a demo. This was presented to our client and the project was completed and moved into live use.',
              'I was Included as a junior architect on a project aimed to convert payment systems that were currently in use throughout the organization. The regulatory environment was changing in order to inhibit fraud. Our company was one of the first to forecast this shift, and we began development immediately. Our most talented developers were teamed to meet the extremely tight delivery date, as this became a concern in the design phase – we had just adopted Agile and extreme programming techniques using Sprints to complete the project. Our team was able to confirm the design and set to work. We were able to finish the project two months ahead of the deadline, and the software architecture is now in use.',
            ],
          },
        ],
        component: (content: any): JSX.Element => <HistoryComponent history={content} />,
      },
    ],
  },
  {
    title: 'Education and Memberships',
    content: [
      'Bachelor of Commerce, Honors (Financial Management), Stellenbosch University, South Africa (2015).',
      'Bachelor of Commerce, Management Science (Information Systems and Financial Management), Stellenbosch University, South Africa (2013).',
      'Employee recognition committee for the department of I.T while at Virginia Tech',
      'Virginia Tech Developer community',
      'During my time employed at MIP, I was voted onto the events committee and was selected by my coworkers to represent them on our office committee.',
    ],
    component: (content: string[]): JSX.Element => <List paragraphs={content} />,
    icon: <School />,
  },
];

export default MenuItems;