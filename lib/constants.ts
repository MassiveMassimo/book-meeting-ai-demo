export const EVENT_TYPES = {
  "15min": {
    id: "15min",
    title: "15 Minute Meeting",
    duration: 15,
    description: "Short sync to discuss quick topics.",
    color: "bg-purple-500",
  },
  "30min": {
    id: "30min",
    title: "30 Minute Meeting",
    duration: 30,
    description: "Standard meeting slot for detailed discussions.",
    color: "bg-blue-500",
  },
  "growth-hacking": {
    id: "growth-hacking",
    title: "Growth Hacking Discussion",
    duration: 60,
    description: "Deep dive into growth strategies and experiments.",
    color: "bg-green-500",
  },
} as const;
