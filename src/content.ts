// Everything the UI says, once per theme (docs/plans/themes.md). Each entry
// holds a `play` and a `work` version side by side; useContent() hands a
// component the current theme's. Both start out the same — edit either freely.
//
// Grouped by screen, then by the element that says it. An entry whose words
// take values is a function. HTML in an entry is parsed with html-react-parser,
// so it can carry <br />, <strong> and links; say so in the comment beside it.
//
// A missing version fails the build: CONTENT must satisfy ContentTree, which
// asks every leaf for both. Not here: <title>, meta tags and the favicon
// (index.html), which stay the same in both themes.
import { PointSystemType, SquareLabelSize } from '@/constants'
import type { ContentTree } from '@/types'

export const CONTENT = {
  brand: {
    // The header lockup's wordmark.
    name: { play: 'Fold & Flip', work: 'Fold & Flip' },
    // The lockup link's accessible name.
    homeLinkLabel: { play: 'Fold and Flip home', work: 'Fold and Flip home' },
  },

  themeSwitch: {
    // Beside the switch: the theme it's showing.
    label: { play: 'Play', work: 'Work' },
    // The switch's accessible name. It's on in Work.
    ariaLabel: { play: 'Work theme', work: 'Work theme' },
  },

  feedback: {
    // The header tile's accessible name, its hover label, and the mobile menu row.
    label: { play: 'Feedback', work: 'Feedback' },
  },

  role: {
    // The window chip.
    admin: { play: 'Admin', work: 'Admin' },
    participant: { play: 'Participant', work: 'Participant' },
  },

  action: {
    startSession: { play: 'Start a session', work: 'Start a session' },
    startNewSession: { play: 'Start a new session', work: 'Start a new session' },
    backToHome: { play: 'Back to Home', work: 'Back to Home' },
    tryAgain: { play: 'Try again', work: 'Try again' },
    tryingAgain: { play: 'Trying again…', work: 'Trying again…' },
    // The error banner's close button, read by screen readers only.
    dismiss: { play: 'Dismiss', work: 'Dismiss' },
  },

  loading: {
    // The strip pinned to the bottom while the next page loads.
    notice: { play: 'loading…', work: 'loading…' },
    // The full-window loader standing in for a whole page.
    windowTitle: { play: 'loading', work: 'loading' },
    windowMessage: { play: 'loading session…', work: 'loading session…' },
  },

  footer: {
    stack: {
      play: 'React · Typescript · Node.js · Socket.io · TailwindCSS',
      work: 'React · Typescript · Node.js · Socket.io · TailwindCSS',
    },
    copyright: {
      play: (year: number) => `© ${year} Rachel Wong`,
      work: (year: number) => `© ${year} Rachel Wong`,
    },
  },

  // The name field Create and Join share.
  nameField: {
    label: { play: 'Name', work: 'Name' },
    placeholder: { play: 'e.g. Rachel', work: 'e.g. Rachel' },
  },

  validation: {
    nameRule: {
      play: 'Use 1-20 letters, numbers or spaces, with no symbols.',
      work: 'Use 1-20 letters, numbers or spaces, with no symbols.',
    },
    descriptionRule: {
      play: (max: number) => `Keep description to ${max} characters or fewer.`,
      work: (max: number) => `Keep description to ${max} characters or fewer.`,
    },
  },

  // A failed join or create, when the server gave no message of its own.
  // Keyed by ActionFailure. The server's messages are shown as it sends them.
  actionFailure: {
    couldNotConnect: { play: 'Could not connect. Try again.', work: 'Could not connect. Try again.' },
    couldNotReachServer: {
      play: 'Could not reach the server. Try again.',
      work: 'Could not reach the server. Try again.',
    },
  },

  create: {
    windowTitle: { play: 'new-session', work: 'new-session' },
    heading: { play: 'New session', work: 'New session' },
    intro: {
      play: 'You are the Admin: you estimate like everyone else, and you can share the session link and end the session.',
      work: 'You are the Admin: you estimate like everyone else, and you can share the session link and end the session.',
    },
    descriptionLabel: { play: 'Ticket or task description', work: 'Ticket or task description' },
    descriptionPlaceholder: { play: 'Optional, e.g. PROJ-12 https://…', work: 'Optional, e.g. PROJ-12 https://…' },
    pointSystemLabel: { play: 'Point system', work: 'Point system' },
    // The segmented buttons, in PointSystemType's order.
    pointSystemName: {
      [PointSystemType.NUMERICAL]: { play: 'Numerical', work: 'Numerical' },
      [PointSystemType.FIBONACCI]: { play: 'Fibonacci', work: 'Fibonacci' },
    },
    sliderLabel: { play: 'Max story point value', work: 'Max story point value' },
    submit: { play: 'Create session', work: 'Create session' },
    submitting: { play: 'Creating session…', work: 'Creating session…' },
  },

  join: {
    windowTitle: { play: 'join', work: 'join' },
    heading: { play: 'Join session', work: 'Join session' },
    submit: { play: 'Join session', work: 'Join session' },
    submitting: { play: 'Joining session…', work: 'Joining session…' },
    privacyNote: {
      play: 'Your estimate stays private until the Admin ends the session and the Reveal shows everyone’s estimates.',
      work: 'Your estimate stays private until the Admin ends the session and the Reveal shows everyone’s estimates.',
    },
  },

  active: {
    windowTitle: { play: 'live', work: 'live' },
    heading: { play: 'Make your Estimate', work: 'Make your Estimate' },
    intro: {
      play: 'Time runs across, Resources go up. Your estimate stays private until the Reveal.',
      work: 'Time runs across, Resources go up. Your estimate stays private until the Reveal.',
    },
  },

  // The Admin's bar under the header on Active.
  shareLink: {
    label: { play: 'Share session link', work: 'Share session link' },
    fieldLabel: { play: 'Session link', work: 'Session link' },
    copy: { play: 'Copy link', work: 'Copy link' },
    copied: { play: 'Copied!', work: 'Copied!' },
  },

  endSession: {
    trigger: { play: 'End session & reveal', work: 'End session & reveal' },
    dialogTitle: { play: 'End this session?', work: 'End this session?' },
    dialogBody: {
      play: 'All estimates are revealed to everyone. No more changes.',
      work: 'All estimates are revealed to everyone. No more changes.',
    },
    cancel: { play: 'Cancel', work: 'Cancel' },
    confirm: { play: 'End session & Reveal', work: 'End session & Reveal' },
  },

  // The estimation grid, running and revealed. The faces, tooltips and labels are
  // put together in src/utils/grid.ts, which joins these pieces.
  grid: {
    axisTime: { play: 'time →', work: 'time →' },
    axisResources: { play: 'resources ↑', work: 'resources ↑' },
    // Your own Selection's face, by how much room the Square has.
    selectionLabel: {
      [SquareLabelSize.FULL]: { play: 'You', work: 'You' },
      [SquareLabelSize.COMPACT]: { play: '★', work: '★' },
    },
    // A crowded revealed Square's face. `\n` splits it over two lines.
    crowdLabelFull: {
      play: (count: number) => `${count}\npeople`,
      work: (count: number) => `${count}\npeople`,
    },
    crowdLabelCompact: {
      play: (count: number) => `×${count}`,
      work: (count: number) => `×${count}`,
    },
    // A Square's accessible name, joined with ", ":
    // "Time 5, resources 3, Mia, your Selection, click to change your Estimate".
    ariaPosition: {
      play: (time: number, resource: number) => `Time ${time}, resources ${resource}`,
      work: (time: number, resource: number) => `Time ${time}, resources ${resource}`,
    },
    ariaNobody: { play: 'nobody', work: 'nobody' },
    ariaYourSelection: { play: 'your Selection', work: 'your Selection' },
    ariaClickToVote: { play: 'click to change your Estimate', work: 'click to change your Estimate' },
    // The popover's title, and the running grid's tooltip.
    position: {
      play: (time: number, resource: number) => `Time ${time} · Resources ${resource}`,
      work: (time: number, resource: number) => `Time ${time} · Resources ${resource}`,
    },
    // A revealed Square's tooltip, joined with " · ": "T5 · R3 · 3 people · click for names".
    shortPosition: {
      play: (time: number, resource: number) => `T${time} · R${resource}`,
      work: (time: number, resource: number) => `T${time} · R${resource}`,
    },
    crowdCount: {
      play: (count: number) => `${count} people`,
      work: (count: number) => `${count} people`,
    },
    hoverForNames: { play: 'hover for names', work: 'hover for names' },
    clickForNames: { play: 'click for names', work: 'click for names' },
  },

  reveal: {
    windowTitle: { play: 'the reveal', work: 'the reveal' },
    noticeHeading: { play: 'All estimates are now revealed!', work: 'All estimates are now revealed!' },
    // Everyone on the Reveal, latecomers too, reads this one.
    noticeLive: {
      play: "Explore the grid to see how everyone estimated, click anywhere on the grid to change your estimate again. Latecomers to this session can see the estimates but they can't add their vote.",
      work: "Explore the grid to see how everyone estimated, click anywhere on the grid to change your estimate again. Latecomers to this session can see the estimates but they can't add their vote.",
    },
    // Welcome's demo can't vote, so it gets its own line.
    noticeDemo: {
      play: 'Hover over the grid to see how everyone estimated.',
      work: 'Hover over the grid to see how everyone estimated.',
    },
    teamHeading: { play: 'your team', work: 'your team' },
    abstained: { play: 'Abstained', work: 'Abstained' },
    liveUpdatesStopped: {
      play: 'Live updates have stopped. Reload to see the latest estimates.',
      work: 'Live updates have stopped. Reload to see the latest estimates.',
    },
  },

  // One layout for every error, only the words change (DESIGN.md §7). The label
  // is both the window title and the Silkscreen line above the heading.
  errorScreen: {
    chip: { play: 'error', work: 'error' },
    notFound: {
      label: { play: 'Sorry, please try again', work: 'Sorry, please try again' },
      title: { play: 'Session not found', work: 'Session not found' },
      body: {
        play: 'This link doesn’t match a live session. Please talk to your team to create another new session',
        work: 'This link doesn’t match a live session. Please talk to your team to create another new session',
      },
    },
    // Departs from §7's second sentence, "When you reconnect you'll join as a new
    // Participant". Only an Admin sees this screen — a Participant is sent back
    // to /join — and an Admin reconnects as the Admin, Selection intact. It also
    // stands in for a backend that can't be reached at all, which on a free host
    // is usually one still waking up.
    connectionLost: {
      label: { play: 'Sorry, please try again later', work: 'Sorry, please try again later' },
      title: { play: 'Connection lost', work: 'Connection lost' },
      body: {
        play: 'We can’t reach the session right now. If the server is waking up, give it a moment and try again.',
        work: 'We can’t reach the session right now. If the server is waking up, give it a moment and try again.',
      },
    },
    somethingWentWrong: {
      label: { play: 'Sorry, please try again later', work: 'Sorry, please try again later' },
      title: { play: 'Something went wrong', work: 'Something went wrong' },
      body: {
        play: 'The session hit an error we didn’t expect. Try again, or start a fresh session.',
        work: 'The session hit an error we didn’t expect. Try again, or start a fresh session.',
      },
    },
  },

  welcome: {
    navigation: {
      mainLabel: { play: 'Main', work: 'Main' },
      howToUse: { play: 'How to use', work: 'How to use' },
      whyIMadeThis: { play: 'Why I made this', work: 'Why I made this' },
      gitHub: { play: 'GitHub', work: 'GitHub' },
      gitHubSublabel: { play: 'Frontend & backend repositories', work: 'Frontend & backend repositories' },
      openMenu: { play: 'Open menu', work: 'Open menu' },
      closeMenu: { play: 'Close menu', work: 'Close menu' },
      // The phone menu's landmark name and its window title.
      menuLabel: { play: 'Menu', work: 'Menu' },
      menuWindowTitle: { play: 'menu', work: 'menu' },
    },

    hero: {
      badge: { play: 'Planning poker for agile product teams', work: 'Planning poker for agile product teams' },
      // HTML. The lines before the accented one.
      headlineLead: { play: 'Teams who<br />estimate together', work: 'Teams who<br />estimate together' },
      // The headline's last line, in the accent colour.
      headlineAccent: { play: 'ship together', work: 'ship together' },
      // HTML.
      body: {
        play: 'A visual tool for estimating story points as a team without anchoring. Share a session link, pick your estimate on the <br />Time × Resources grid in private, then reveal together and <br />talk through what it takes to ship.',
        work: 'A visual tool for estimating story points as a team without anchoring. Share a session link, pick your estimate on the <br />Time × Resources grid in private, then reveal together and <br />talk through what it takes to ship.',
      },
    },

    // The hero's sample Reveal. Someone must land on WELCOME_DEMO_PINNED
    // (5, 3), where the popover opens, and every Square must sit on
    // WELCOME_DEMO_AXIS_VALUES.
    demo: {
      reveal: {
        play: {
          squares: [
            { time: 8, resource: 5, names: ['Jim-2'] },
            { time: 5, resource: 3, names: ['Mia', 'Jim-1', 'Noor'] },
            { time: 5, resource: 2, names: ['Ben'] },
            { time: 3, resource: 2, names: ['Priya'] },
            { time: 5, resource: 1, names: ['Sam'] },
          ],
          abstained: ['Alex'],
        },
        work: {
          squares: [
            { time: 8, resource: 5, names: ['Jim-2'] },
            { time: 5, resource: 3, names: ['Mia', 'Jim-1', 'Noor'] },
            { time: 5, resource: 2, names: ['Ben'] },
            { time: 3, resource: 2, names: ['Priya'] },
            { time: 5, resource: 1, names: ['Sam'] },
          ],
          abstained: ['Alex'],
        },
      },
      // The sample Session's ticket, so the demo Reveal reads like a real one.
      // Plain text: a URL in it becomes a link, as in a real description.
      description: {
        play: 'Add a demo description to this feature here https://github.com/rachelwong/estimator-frontend',
        work: 'Add a demo description to this feature here https://github.com/rachelwong/estimator-frontend',
      },
    },

    howToUse: {
      heading: { play: 'How to use', work: 'How to use' },
      // HTML.
      intro: {
        play: 'Estimation is hard. Teams have to weigh up unknowns, dependencies and effort so that product owners, team leads and businesses can make calls that affect everyone. <br />All too often the first number callout or the loudest voices becomes the answer. <br /><br /><strong>Fold &amp; Flip</strong> is an ice-breaker/planning-poker tool that gives every team member a chance to estimate. It keeps every estimate hidden until everyone is ready, so you hear what the entire team actually thinks. <br />Every story point on the grid is a function of <strong>time</strong> (velocity) and <strong>resources</strong> (or effort), relative to other tasks or tickets in queue.<br /><br />Estimating is a conversation starter, not a line in the sand.',
        work: 'Estimation is hard. Teams have to weigh up unknowns, dependencies and effort so that product owners, team leads and businesses can make calls that affect everyone. <br />All too often the first number callout or the loudest voices becomes the answer. <br /><br /><strong>Fold &amp; Flip</strong> is an ice-breaker/planning-poker tool that gives every team member a chance to estimate. It keeps every estimate hidden until everyone is ready, so you hear what the entire team actually thinks. <br />Every story point on the grid is a function of <strong>time</strong> (velocity) and <strong>resources</strong> (or effort), relative to other tasks or tickets in queue.<br /><br />Estimating is a conversation starter, not a line in the sand.',
      },
      // The tag on each card.
      stepLabel: {
        play: (level: number) => `Step.${level}`,
        work: (level: number) => `Step.${level}`,
      },
      // Each card's description is HTML.
      startSession: {
        title: { play: 'Start a session', work: 'Start a session' },
        description: {
          play: 'Choose a Point system (Numerical or <a href="https://www.atlassian.com/agile/project-management/fibonacci-story-points" target="_blank" class="link">Fibonacci</a>) to set the maximum number of story points you can allocate towards a feature or a ticket.<br />Share the link with the team.',
          work: 'Choose a Point system (Numerical or <a href="https://www.atlassian.com/agile/project-management/fibonacci-story-points" target="_blank" class="link">Fibonacci</a>) to set the maximum number of story points you can allocate towards a feature or a ticket.<br />Share the link with the team.',
        },
      },
      cardsDown: {
        title: { play: 'Cards down', work: 'Cards down' },
        description: {
          play: "Everyone selects a square on the points grid, with time on the horizontal axis and resources (or effort) on the vertical axis. Nobody sees anyone else's estimate.",
          work: "Everyone selects a square on the points grid, with time on the horizontal axis and resources (or effort) on the vertical axis. Nobody sees anyone else's estimate.",
        },
      },
      theFlip: {
        title: { play: 'The Flip', work: 'The Flip' },
        description: {
          play: 'Once admin has confirmed everyone has estimated, the session is ended. All the estimates are revealed, including anyone who might have abstained.',
          work: 'Once admin has confirmed everyone has estimated, the session is ended. All the estimates are revealed, including anyone who might have abstained.',
        },
      },
      talkItThrough: {
        title: { play: 'Talk it through', work: 'Talk it through' },
        description: {
          play: "Talk through everyone's estimates, ask hard questions to flag uncertainties and dependencies. The best thing is the team can change their estimates!",
          work: "Talk through everyone's estimates, ask hard questions to flag uncertainties and dependencies. The best thing is the team can change their estimates!",
        },
      },
    },

    whyIMadeThis: {
      heading: { play: 'Why I made this', work: 'Why I made this' },
      frontendLink: { play: 'Frontend on GitHub', work: 'Frontend on GitHub' },
      backendLink: { play: 'Backend on GitHub', work: 'Backend on GitHub' },
      // Each note's text is HTML.
      experience: {
        label: { play: 'the experience', work: 'the experience' },
        text: {
          play: `This side project was inspired by the agile ceremonies, ideation workshops and stand-ups I've been part of at work. Estimation is hard, yet many decisions that shape a product team hinge upon it.
<br/><br/>
In my experience, a few things make estimates less reliable:<br/>
<ul className='list-disc my-2 pl-4'>
<li>tasks scoped too large or too ambitiously</li>
<li>scope creep</li>
<li>the first number called out becomes the answer</li>
<li>the same voices every sprint planning</li>
<li>not all stakeholders are in the room</li>
<li>not everyone feels able to contribute or ask questions</li>
</ul>
`,
          work: `This side project was inspired by the agile ceremonies, ideation workshops and stand-ups I've been part of at work. Estimation is hard, yet many decisions that shape a product team hinge upon it.
<br/><br/>
In my experience, a few things make estimates less reliable:<br/>
<ul className='list-disc my-2 pl-4'>
<li>tasks scoped too large or too ambitiously</li>
<li>scope creep</li>
<li>the first number called out becomes the answer</li>
<li>the same voices every sprint planning</li>
<li>not all stakeholders are in the room</li>
<li>not everyone feels able to contribute or ask questions</li>
</ul>
`,
        },
      },
      idea: {
        label: { play: 'the idea', work: 'the idea' },
        text: {
          play: `There's plenty of formal literature on <a href='https://agilemanifesto.org/' target='_blank' className='link'>agile</a>, <a className='link' href='https://www.atlassian.com/blog/developers/planning-poker-sane-healthy' target='_blank'>estimation</a> and <a className='link' href='https://www.atlassian.com/agile/scrum' target='_blank'>Scrum</a>. I deliberately avoided reading those or referring to existing estimation tools on the market, because I wanted to build something that addressed what I'd personally observed in previous teams.
<br/><br/>
I want to create a tool that invites every team member to contribute visibly and meaningfully to estimating, makes room for discussion when it's needed, and brings everyone into alignment. A story point is a good-faith rough estimate, not a binding guarantee.`,
          work: `There's plenty of formal literature on <a href='https://agilemanifesto.org/' target='_blank' className='link'>agile</a>, <a className='link' href='https://www.atlassian.com/blog/developers/planning-poker-sane-healthy' target='_blank'>estimation</a> and <a className='link' href='https://www.atlassian.com/agile/scrum' target='_blank'>Scrum</a>. I deliberately avoided reading those or referring to existing estimation tools on the market, because I wanted to build something that addressed what I'd personally observed in previous teams.
<br/><br/>
I want to create a tool that invites every team member to contribute visibly and meaningfully to estimating, makes room for discussion when it's needed, and brings everyone into alignment. A story point is a good-faith rough estimate, not a binding guarantee.`,
        },
      },
      build: {
        label: { play: 'the build', work: 'the build' },
        text: {
          play: `
          I used this project to explore two things I'd shelved for 'later': back-end development and Claude Code. I've documented my process in detail in each repo's README. In a nutshell, I seeded the project with a <a className='link' href='https://miro.com/app/board/uXjVH-RcLGw=/?share_link_id=902798596342'>Miro board of storyboards</a> and a <a className='link' href='https://app.notion.com/p/rachelwong/Estimator-3bb375d34b3480548d26edd98dcc8a11?source=copy_link'>Notion doc</a>. I've used interview-style prompts and <a href='https://github.com/mattpocock/skills' className='link'>Matt Pocock's grilling skills</a>. Each stage is effectively a pull request: I review it, make manual changes, grill it, and commit manually. And make more manual changes for code quality. <br /><br/>Claude-driven design can be fun, but I would still reach for a human designer for good taste.
I haven't yet figured out the best way to use AI; still to come.
          `,
          work: `
          I used this project to explore two things I'd shelved for 'later': back-end development and Claude Code. I've documented my process in detail in each repo's README. In a nutshell, I seeded the project with a <a className='link' href='https://miro.com/app/board/uXjVH-RcLGw=/?share_link_id=902798596342'>Miro board of storyboards</a> and a <a className='link' href='https://app.notion.com/p/rachelwong/Estimator-3bb375d34b3480548d26edd98dcc8a11?source=copy_link'>Notion doc</a>. I've used interview-style prompts and <a href='https://github.com/mattpocock/skills' className='link'>Matt Pocock's grilling skills</a>. Each stage is effectively a pull request: I review it, make manual changes, grill it, and commit manually. And make more manual changes for code quality. <br /><br/>Claude-driven design can be fun, but I would still reach for a human designer for good taste.
I haven't yet figured out the best way to use AI; still to come.
          `,
        },
      },
    },

    // Six things worth knowing before a first Session. Each description is HTML.
    houseRules: {
      heading: { play: 'House rules', work: 'House rules' },
      livePrivate: {
        title: { play: 'Live, but private', work: 'Live, but private' },
        description: {
          play: 'The session updates in real time, but nobody sees any Estimates until the Reveal.',
          work: 'The session updates in real time, but nobody sees any Estimates until the Reveal.',
        },
      },
      noSignUp: {
        title: { play: 'No sign-up', work: 'No sign-up' },
        description: {
          play: 'Open the link and type in a name. That’s all you need.',
          work: 'Open the link and type in a name. That’s all you need.',
        },
      },
      uniqueLink: {
        title: { play: 'Unique link', work: 'Unique link' },
        description: {
          play: 'Every new session gets its own link. Share it with your team.',
          work: 'Every new session gets its own link. Share it with your team.',
        },
      },
      changeYourMind: {
        title: { play: 'Change your mind', work: 'Change your mind' },
        description: {
          play: 'Admin and users can change their estimates any time. Once a session has been revealed though, no latecomers can join the session to add their estimates',
          work: 'Admin and users can change their estimates any time. Once a session has been revealed though, no latecomers can join the session to add their estimates',
        },
      },
      twoAxes: {
        title: { play: 'Two axes, one grid', work: 'Two axes, one grid' },
        description: {
          play: 'Time and Resources are relative. Resources can mean effort, unknowns &amp; complexities.',
          work: 'Time and Resources are relative. Resources can mean effort, unknowns &amp; complexities.',
        },
      },
      nothingKept: {
        title: { play: 'Nothing is kept', work: 'Nothing is kept' },
        description: {
          play: "Sessions only live in memory. No accounts, no history. We don't ask for or store anything about you.",
          work: "Sessions only live in memory. No accounts, no history. We don't ask for or store anything about you.",
        },
      },
    },

    callToAction: {
      // HTML.
      headline: { play: 'Flip the points<br />Align the team<br />', work: 'Flip the points<br />Align the team<br />' },
    },

    // What the crowd in the closing band says when someone hovers one of them —
    // the easter egg. A random line each time, never the same one twice running.
    // Keep each to about 28 characters: tablet and desktop set it on one line in
    // the gap between the headline and the crowd, and a longer one runs into the
    // words.
    crowdChatter: {
      lines: {
        play: [
          'I’m a 3. Fight me.',
          'Who put this on a 21?',
          'Does that include testing?',
          'Scope creep says hi.',
          'Refill before the Reveal.',
          "Gentle reminder: it's hard.",
          'Merge conflicts? Add 3.',
          "I'm with whoever's lowest.",
          "I'm going big. Sorry.",
          'Consensus? In this economy?',
          'Edge cases entered the chat.',
          "That's future me's problem.",
          'Velocity? Never heard of it.',
          "Pretty sure it's a 2. Ish.",
          'I estimate in naps.',
          'Coffee first, numbers later.',
          'Is this before or after QA?',
          'Can I phone a senior dev?',
          "Nobody say 'just'.",
          'Outlier and proud.',
          'The Reveal is my cardio.',
          'I changed my mind. Again.',
          'Same Square? Great minds.',
          "That's a spike, not a story.",
          'Did anyone read the ticket?',
          'The Admin has spoken.',
          'Legacy code? Add a zero.',
          "Is 'it depends' an Estimate?",
        ],
        work: [
          'I’m a 3. Fight me.',
          'Who put this on a 21?',
          'Does that include testing?',
          'Scope creep says hi.',
          'Refill before the Reveal.',
          "Gentle reminder: it's hard.",
          'Merge conflicts? Add 3.',
          "I'm with whoever's lowest.",
          "I'm going big. Sorry.",
          'Consensus? In this economy?',
          'Edge cases entered the chat.',
          "That's future me's problem.",
          'Velocity? Never heard of it.',
          "Pretty sure it's a 2. Ish.",
          'I estimate in naps.',
          'Coffee first, numbers later.',
          'Is this before or after QA?',
          'Can I phone a senior dev?',
          "Nobody say 'just'.",
          'Outlier and proud.',
          'The Reveal is my cardio.',
          'I changed my mind. Again.',
          'Same Square? Great minds.',
          "That's a spike, not a story.",
          'Did anyone read the ticket?',
          'The Admin has spoken.',
          'Legacy code? Add a zero.',
          "Is 'it depends' an Estimate?",
        ],
      },
    },
  },
} satisfies ContentTree
