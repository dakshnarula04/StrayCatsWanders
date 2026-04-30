import type { TripData } from "../types";

export const trips: TripData[] = [
  {
    id: "roopkund-2023",
    title: "The Mystery of Roopkund",
    location: "Chamoli, Uttarakhand",
    date: "June 2023",
    imageUrl: "https://picsum.photos/seed/roopkund/800/500",
    imageAlt: "The frozen lake of Roopkund surrounded by peaks",
    tags: ["hiking", "mountains", "lakes"],
    excerpt: "A challenging trek to the high-altitude glacial lake, known for the ancient skeletons found at its edge.",
    featured: true
  },
  {
    id: "valley-of-flowers",
    title: "Valley of Flowers Bloom",
    location: "Bhyundar, Uttarakhand",
    date: "August 2023",
    imageUrl: "https://picsum.photos/seed/valley/800/500",
    imageAlt: "A vibrant meadow filled with wildflowers",
    tags: ["hiking", "forest", "mountains"],
    excerpt: "Witnessing the breathtaking alpine meadows in full bloom after the monsoon rains.",
    featured: true
  },
  {
    id: "kedarkantha-winter",
    title: "Kedarkantha Peak Summit",
    location: "Uttarkashi, Uttarakhand",
    date: "December 2022",
    imageUrl: "https://picsum.photos/seed/kedarkantha/800/500",
    imageAlt: "Snow-covered peaks at sunrise",
    tags: ["winter", "mountains", "hiking"],
    excerpt: "Navigating through knee-deep snow to reach the summit of one of the most beautiful winter treks.",
    featured: false
  },
  {
    id: "rishikesh-solo",
    title: "Riverside Solitude",
    location: "Rishikesh, Uttarakhand",
    date: "October 2022",
    imageUrl: "https://picsum.photos/seed/rishikesh/800/500",
    imageAlt: "The Ganges river flowing through the mountains",
    tags: ["solo", "lakes", "forest"],
    excerpt: "A week of quiet reflection and exploration along the banks of the mighty Ganges.",
    featured: false
  },
  {
    id: "chopta-tungnath",
    title: "Highest Shiva Temple",
    location: "Chopta, Uttarakhand",
    date: "March 2022",
    imageUrl: "https://picsum.photos/seed/chopta/800/500",
    imageAlt: "The ancient Tungnath temple covered in light snow",
    tags: ["hiking", "mountains", "solo"],
    excerpt: "A spiritual and physical journey to Tungnath, the highest Shiva temple in the world.",
    featured: false
  },
  {
    id: "kanatal-pine-forest",
    title: "Whispering Pines",
    location: "Kanatal, Uttarakhand",
    date: "January 2022",
    imageUrl: "https://picsum.photos/seed/kanatal/800/500",
    imageAlt: "Dense pine forest shrouded in mist",
    tags: ["forest", "winter", "solo"],
    excerpt: "Camping amidst the towering pines and deodars, experiencing the true silence of the woods.",
    featured: false
  }
];
