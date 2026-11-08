import React from "react";
import useScrollReset from "../../hooks/useScrollReset";
import {
  CsPage,
  CsBreadcrumb,
  CsHero,
  CsIntro,
  CsSection,
  CsH3,
  CsText,
  CsCallout,
  CsPanel,
  CsStats,
  CsChips,
  CsHmw,
  CsImg,
  CsVideo,
  CsEmbed,
  CsSeeNext,
} from "../../components/CsKit/CsKit";
import FlowRoute from "../../components/FlowRoute/FlowRoute";
import "./SummerTypography.css";

// From the app's design tokens (time-manager src/styles/colors.css).
const SWATCHES = [
  { hex: "#1900FF", label: "BRAND BLUE" },
  { hex: "#212D5C", label: "BRAND NAVY" },
  { hex: "#000000", label: "INK" },
  { hex: "#FFFFFF", label: "WHITE" },
  { hex: "#F8F9FA", label: "APP SURFACE" },
  { hex: "#6B7280", label: "SECONDARY TEXT" },
];

// Screens captured from the shipped app (the time-manager repo).
const APP = "/work/time-management/app";
const EMPLOYEE_SCREENS = [
  { src: `${APP}/login.webp`, label: "Sign in as Employee or Admin" },
  { src: `${APP}/emp-dashboard.webp`, label: "Employee home" },
  { src: `${APP}/emp-timesheet.webp`, label: "Timesheet" },
  { src: `${APP}/emp-skills.webp`, label: "Skills and certifications" },
];
const ADMIN_SCREENS = [
  { src: `${APP}/admin-dashboard.webp`, label: "Admin dashboard" },
  { src: `${APP}/clients.webp`, label: "Clients" },
  { src: `${APP}/client-profile.webp`, label: "Client profile" },
  { src: `${APP}/client-new.webp`, label: "Add client" },
  { src: `${APP}/roles.webp`, label: "Roles" },
  { src: `${APP}/role-new.webp`, label: "Add role and module access" },
];

const TimeManagementCaseStudy = () => {
  useScrollReset();

  return (
    <CsPage project="time-management" accent="#1A56DB" tint="#E8EEFC">
      <CsBreadcrumb current="Summer" />
      <CsHero>
        <img
          src={`${APP}/landing.webp`}
          alt="Summer landing page: Manage projects smarter and track time efficiently"
          loading="eager"
          decoding="async"
        />
      </CsHero>

      <CsIntro
        title="Summer: Time tracking Web Application"
        lead="This is a web application that allows the company to track their employees' productivity and helps analyze the insights and increase employees' productivity."
        meta={[
          {
            label: "Role",
            value: [
              "UX Researcher",
              "UX Designer",
              "Interaction Designer",
              "Full Stack Developer",
            ],
          },
          { label: "Timeline", value: "Feb to March 2024" },
          {
            label: "Tools",
            value: ["Figma", "VS Code", "Cursor AI", "Supabase SQL"],
          },
          {
            label: "Scope",
            value: [
              "Human Interface Design",
              "UX Research",
              "Data Application",
              "Web Development",
            ],
          },
        ]}
      />

      <CsSection id="time-management-context" label="Overview" title="Goal">
        <CsText>
          Teams do their best work when everyone can see how the workday is
          unfolding: who is logged in, where time is going, and who has room to
          take on more. The goal was to bring that whole picture together in one
          clear view that managers can read at a glance and genuinely want to
          return to every day.
        </CsText>
        <CsPanel title="The finished product">
          <CsImg
            src={`${APP}/admin-dashboard.webp`}
            alt="Summer admin dashboard with active clients, open projects, and team activity"
          />
        </CsPanel>
        <CsH3>User Research</CsH3>
        <CsText>
          The application was something I was pretty confident of from the
          start. The client gave me all the requirements, and I immediately
          started giving him ideas, but he wanted a{" "}
          <strong>simple, not sophisticated and easy to navigate</strong> and
          intuitive design. So I made sure to apply minimalist principles in
          designing the web application and started designing in Figma.
        </CsText>
        <CsText>
          But before that, I had to decide the different roles of employees
          that would be using the application. Then I defined the user flow and
          came up with a development plan for <strong>over 3 weeks</strong>.
        </CsText>
        <CsPanel title="User flow" padded>
          <FlowRoute
            node="Timesheet"
            question="Approve it?"
            yes={{ label: "YES", title: "Approved", icon: "✓", idle: "NONE YET", active: "{n} APPROVED" }}
            no={{ label: "NO", title: "Exceptions", icon: "!", idle: "CLEAR", active: "{n} TO REVIEW" }}
            items={[
              { icon: "◔", title: "Daily log", sub: "3 hrs on Client Y, App Debugging", to: "yes" },
              { icon: "✎", title: "Off-site meeting", sub: "Logged by hand, needs a reason", to: "no" },
              { icon: "▦", title: "Weekly timesheet", sub: "Bulk approve by Friday 5 PM", to: "yes" },
              { icon: "⚑", title: "Punch-in mismatch", sub: "Flagged for the manager", to: "no" },
              { icon: "↗", title: "Client report", sub: "Exported by client and project", to: "yes" },
            ]}
          />
        </CsPanel>
        <CsPanel title="Requirements, user flow, and roles" wide>
          <CsImg
            src="/work/time-management/user-flow.webp"
            alt="Time Management Requirements, User Flow, and Roles Diagram"
          />
        </CsPanel>
        <CsH3>Impact</CsH3>
        <CsStats
          items={[
            { value: "50+", label: "Employees supported" },
            { value: "20%", label: "Increase in workforce efficiency" },
            { value: "30%", label: "Reduction in admin effort" },
          ]}
        />
      </CsSection>

      <CsSection label="Requirements & users" title="Who it was for, and what they needed">
        <CsPanel title="Requirements">
          <CsImg
            src="/work/time-management/frame-145.png"
            alt="Time Management Requirements"
          />
        </CsPanel>
        <CsPanel title="Users">
          <CsImg
            src="/work/time-management/frame-147.png"
            alt="Time Management Users"
          />
        </CsPanel>
        <CsH3>Motivations</CsH3>
        <CsText>
          A platform that can handle multiple functions within a single
          application to save time.
        </CsText>
        <CsH3>Painpoints</CsH3>
        <CsChips
          items={[
            "Lack of good UX",
            "Better user flow",
            "Save time",
            "Security concerns",
          ]}
        />
        <CsHmw
          items={[
            {
              question:
                "How might we give managers real time visibility into attendance and productivity?",
              solution:
                "Role based dashboards surface clock ins, task progress, and performance at a glance, cutting manual check ins.",
            },
            {
              question:
                "How might we make clocking in and tracking time effortless across the team?",
              solution:
                "A one tap clock in and a simple daily view keep logging quick, so adoption sticks with 50+ employees.",
            },
            {
              question:
                "How might we help employees grow, not only get tracked?",
              solution:
                "A skills feature lets employees select and track job competencies, tying daily work to personal development.",
            },
          ]}
        />
      </CsSection>

      <CsSection id="solution-section" label="Final product" title="Designing it, then building it">
        <CsText>
          I love <strong>designing applications</strong> and seeing them come
          alive. But I&apos;ll tell you, development is something out of my
          league, at least that&apos;s what I thought until I worked on this
          project. I learned how databases work, and how to code while still
          maintaining the UI, so it doesn&apos;t compromise the client&apos;s
          vision.
        </CsText>
        <CsText>
          In this process I also learned how to <strong>vibe code</strong>.
          Although I don&apos;t use AI for idea generation, using it as a tool
          to build a more functional web application was something I enjoyed
          experimenting with.
        </CsText>

        <CsH3>Low Fidelity Prototypes</CsH3>
        <CsPanel title="Lo-fi wireframes" wide>
          <CsEmbed
            src="/work/time-management/wireframe-lofi-prototypes.html"
            title="Lo-Fi Wireframes, Summer"
            height="700px"
          />
        </CsPanel>

        <CsH3>High Fidelity Prototypes</CsH3>
        <CsPanel title="Employee area" wide>
          <div className="cs-shot-grid">
            {EMPLOYEE_SCREENS.map((screen) => (
              <figure key={screen.src} className="cs-shot">
                <CsImg src={screen.src} alt={`Summer ${screen.label} screen`} />
                <figcaption>{screen.label}</figcaption>
              </figure>
            ))}
          </div>
        </CsPanel>
        <CsPanel title="Admin area" wide>
          <div className="cs-shot-grid">
            {ADMIN_SCREENS.map((screen) => (
              <figure key={screen.src} className="cs-shot">
                <CsImg src={screen.src} alt={`Summer ${screen.label} screen`} />
                <figcaption>{screen.label}</figcaption>
              </figure>
            ))}
          </div>
        </CsPanel>
        <CsText>
          These are the screens from the coded product. Sign in splits into two
          workflows. Employees get a flat, three screen area with no sidebar:
          a timesheet with a start and stop timer, their skills and
          certifications, and their profile. Admins get a sidebar dashboard
          for running the business: a searchable client list with a profile
          for each client (contact, projects, and invoices), an add client
          flow, and roles with a per module access checklist. Together they
          carry the clean, minimal visual language from wireframe to working
          interface.
        </CsText>

        <div id="time-management-solutions">
          <CsH3>Solution #1: Centralized Client Management</CsH3>
          <CsCallout>
            Every client, their projects, and their invoices live in{" "}
            <span className="cs-accent">one place</span>.
          </CsCallout>
          <CsPanel title="Clients">
            <CsVideo
              src={`${APP}/sol-clients.mp4`}
              label="Searching the client list and opening a client's contact, projects, and invoices"
            />
          </CsPanel>
          <CsText>
            Admins search the client list and open any client to see their
            contact details, the projects underway with hours logged, and
            invoices with what is <strong>paid or still outstanding</strong>.
            This pulled what used to be scattered admin tasks into the single
            application the client asked for.
          </CsText>

          <CsH3>Solution #2: Employee Skill Tracking</CsH3>
          <CsCallout>
            Every employee profile tracks{" "}
            <span className="cs-accent">real skills and proficiency</span>.
          </CsCallout>
          <CsPanel title="Skills">
            <CsVideo
              src={`${APP}/sol-skills.mp4`}
              label="An employee adding Revit MEP as an Expert level skill"
            />
          </CsPanel>
          <CsText>
            Employees add a skill and set their level, from Beginner to
            Certified, right on their Skills page, alongside the skills they
            already hold. This was one of the more interesting ideas to come
            out of ideation:{" "}
            <strong>giving employees a clear view of where they stood</strong>{" "}
            so they could focus on what they were actually lacking.
          </CsText>

          <CsH3>Solution #3: Roles and Module Access</CsH3>
          <CsCallout>
            Admins decide exactly{" "}
            <span className="cs-accent">who can see what</span>.
          </CsCallout>
          <CsPanel title="Roles and access">
            <CsVideo
              src={`${APP}/sol-roles.mp4`}
              label="Viewing a role's permissions, then creating a Project Manager role and switching on its modules"
            />
          </CsPanel>
          <CsText>
            Each role lists its permissions and the people assigned to it.
            Creating a role means naming it and{" "}
            <strong>switching on only the modules it needs</strong>, from
            clients and projects to time tracking, so access stays deliberate
            as the team grows.
          </CsText>

          <CsH3>Solution #4: One Tap Time Tracking</CsH3>
          <CsCallout>
            Clocking in takes{" "}
            <span className="cs-accent">one tap</span>.
          </CsCallout>
          <CsPanel title="Time tracking">
            <CsVideo
              src={`${APP}/sol-timer.mp4`}
              label="Starting a timer on a client project and activity, then stopping it"
            />
          </CsPanel>
          <CsText>
            Employees pick the client, project, and activity, start the timer,
            and stop it when they are done, and the entry lands in their
            timesheet. Keeping it this quick is what{" "}
            <strong>made logging stick</strong> across a team of 50+ people.
          </CsText>
        </div>
      </CsSection>

      <CsSection
        id="time-management-research"
        label="Key design moments"
        title="Keeping it simple"
      >
        <CsText>
          During the ideation process, I came up with different types of
          screens, but <strong>the client</strong> wanted the most{" "}
          <strong>simplistic and easy to navigate</strong> and intuitive
          design.
        </CsText>
        <CsText>
          So I followed Apple&apos;s guidelines to provide the best experience
          for the client.
        </CsText>
        <CsText>
          But one interesting feature was to give our different{" "}
          <strong>skillsets to employees</strong> to improve the skill that
          they select over time. It helped the employees a lot to{" "}
          <strong>focus on what they were actually lacking</strong> in.
        </CsText>

      </CsSection>

      <CsSection
        id="time-management-takeaways"
        label="Reflections"
        title="Simple is the hard part"
      >
        <CsText>
          This one taught me that &quot;simple&quot; is the hard part. The
          client kept pulling me back from clever features toward something
          genuinely easy to use, and building it end to end, from the first
          Figma frame to working code, showed me how much restraint good design
          really takes.
        </CsText>
      </CsSection>

      <CsSeeNext id="time-management-see-next" current="summer" />
    </CsPage>
  );
};

export default TimeManagementCaseStudy;
