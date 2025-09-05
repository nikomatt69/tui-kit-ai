import {
  Avatar,
  Badge,
  Box,
  Breadcrumb,
  Button,
  Card,
  Checkbox,
  Collapsible,
  Divider,
  Gauge,
  HelpOverlay,
  KeyHint,
  LogViewer,
  Modal,
  Notification,
  Panel,
  Paragraph,
  ProgressBar,
  ProgressDots,
  ProgressSpinner,
  Prompt as PromptBox,
  Scrollable,
  SearchBox,
  Select,
  Spinner,
  StatusIndicator,
  Stepper,
  Table,
  Tabs,
  Text,
  TextInput,
  Toast,
  Tooltip,
  Tree,
} from "@tui-kit-ai/core";
import blessed from "blessed";

// Create screen
const screen = blessed.screen({
  smartCSR: true,
  title: "Core Components Gallery",
});
screen.key(["C-c", "q"], () => process.exit(0));

// Header
const header = new Box({
  parent: screen,
  top: 0,
  left: 0,
  right: 0,
  height: 3,
  borderStyle: "line",
  label: " Header ",
  focusable: false,
});
new Text({
  parent: header.el,
  left: 2,
  top: 1,
  content: "TUI Kit Core Components",
} as any);

// Buttons row
new Button({
  parent: screen,
  top: 4,
  left: 2,
  text: "Primary",
  variant: "primary",
  focusable: true,
  scrollable: false,
  onClick: () => showModal("Primary clicked"),
});
new Button({
  parent: screen,
  top: 4,
  left: 20,
  text: "Secondary",
  focusable: true,
  scrollable: false,
  variant: "secondary",
  onClick: () => showModal("Secondary clicked"),
});
new Button({
  parent: screen,
  top: 4,
  left: 40,
  text: "Ghost",
  focusable: true,
  scrollable: false,
  variant: "ghost",
  onClick: () => showModal("Ghost clicked"),
});

// Scrollable gallery container
const content = new Box({
  parent: screen,
  top: 8,
  left: 2,
  right: 2,
  height: "70%",
  borderStyle: "line",
  label: " Core Components Gallery ",
  scrollable: true,
  padding: [0, 1],
  focusable: true,
});

let y = 1;
function title(t: string) {
  new Text({ parent: content.el, top: y, left: 0, content: `== ${t} ==` });
  y += 2;
}
function place<T extends { el: blessed.Widgets.BlessedElement }>(c: T, h = 3) {
  c.el.top = y as any;
  y += h + 1;
}

// Layout & Containers
title("Box / Divider / Paragraph");
place(
  new Box({
    parent: content.el,
    left: 0,
    width: "100%",
    height: 3,
    borderStyle: "line",
    label: "Box",
    focusable: true,
  })
);
place(new Divider({ parent: content.el }));
place(
  new Paragraph({
    parent: content.el,
    text: "Paragraph component with some content text.",
    borderStyle: "line",
  })
);

title("Badges / Status");
place(
  new Badge({
    parent: content.el,
    text: "New",
    variant: "success",
    focusable: true,
    scrollable: true,
  })
);
place(
  new StatusIndicator({
    parent: content.el,
    status: "success",
    text: "Success",
  })
);

title("Avatar");
place(new Avatar({ parent: content.el, initials: "NE" } as any));

title("Spinner / ProgressBar / ProgressDots / ProgressSpinner / Gauge");
place(new Spinner({ parent: content.el, text: "Loading..." }));
place(new ProgressBar({ parent: content.el, value: 60 }));
place(new ProgressDots({ parent: content.el }));
place(new ProgressSpinner({ parent: content.el }));
place(
  new Gauge({
    parent: content.el,
    blessedProps: { filled: 30, width: 20 } as any,
  })
);

title("Toast / Notification");
place(new Toast({ parent: content.el, text: "Saved!", type: "success" }));
place(
  new Notification({ parent: content.el, message: "Heads up: action required" })
);

title("Card / Panel");
place(
  new Card({
    parent: content.el,
    title: "Card",
    subtitle: "Subtitle",
    content: "Card content",
  })
);
place(new Panel({ parent: content.el, title: "Panel", collapsible: true }));

title("Inputs");
place(
  new TextInput({ parent: content.el, label: "TextInput", width: 30 } as any)
);
place(new Checkbox({ parent: content.el, label: "Checkbox" } as any));

place(new Select({ parent: content.el, options: ["One", "Two", "Three"] }));
place(new SearchBox({ parent: content.el, label: "Search" } as any));
place(
  new PromptBox({
    parent: content.el,
    message: "Enter value:",
    onSubmit: () => {},
  })
);

title("Navigation");
place(
  new Breadcrumb({
    parent: content.el,
    focusable: true,
    scrollable: true,
    items: [
      { label: "Home", id: "home" },
      { label: "Library", id: "library" },
      { label: "Data", id: "data" },
    ],
  })
);
place(
  new Tabs({
    parent: content.el,
    tabs: [
      {
        id: "t1",
        label: "Tab 1",
        render: (p) => blessed.box({ parent: p, content: "Tab 1 content" }),
      },
      {
        id: "t2",
        label: "Tab 2",
        render: (p) => blessed.box({ parent: p, content: "Tab 2 content" }),
      },
    ],
  })
);
place(
  new Stepper({
    parent: content.el,
    steps: [{ label: "Step 1" }, { label: "Step 2" }],
    activeIndex: 0,
  })
);

title("Data");
place(
  new Table({
    parent: content.el,
    headers: ["Col A", "Col B"],
    rows: [
      ["A", "1"],
      ["B", "2"],
    ],
  })
);
place(
  new Tree({
    parent: content.el,
    data: [{ label: "Node 1", children: [{ label: "Child" }] }],
  })
);
place(
  new LogViewer({
    parent: content.el,
    blessedProps: { content: "log line 1\nlog line 2" } as any,
  })
);

title("UX");
const tipTarget = new Box({
  parent: content.el,
  borderStyle: "line",
  label: "Hover me",
  width: 20,
  height: 3,
} as any).el;
place({ el: tipTarget } as any);
place(
  new Tooltip({
    parent: content.el,
    content: "Tooltip",
    target: tipTarget,
  } as any)
);
place(new HelpOverlay({ parent: content.el, content: "Help overlay" }));
place(
  new Scrollable({
    parent: content.el,
    blessedProps: { content: "Scrollable content" } as any,
  })
);
place(
  new KeyHint({
    parent: content.el,
    hints: [
      { key: "q", label: "quit" },
      { key: "enter", label: "select" },
    ],
  })
);
place(
  new Collapsible({
    parent: content.el,
    title: "Collapsible",
    content: "Hidden content",
  })
);

let modal: Modal | null = null;
function showModal(message: string) {
  if (modal) {
    modal.destroy();
    modal = null;
  }
  modal = new Modal({
    parent: screen,
    title: "Action",
    content: message,
    closable: true,
  });
}

screen.render();
