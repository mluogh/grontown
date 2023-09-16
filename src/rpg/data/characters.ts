import Topics from "./topics";

export type Action = {
  name: string;
  startFrame: number;
  endFrame: number;
  frameRate?: number;
};

export type Character = {
  eastworldId: string | null;
  sprite: string;
  photo: string;
  interactTopic: Topics;
  actions: Array<Action>;
  arrestable: boolean;
};

type PartialCharacter = Partial<Character>;

const defaultCharacter: Character = {
  eastworldId: null,
  sprite: "",
  photo: "",
  interactTopic: Topics.enterChat,
  actions: [],
  arrestable: true,
};

function createCharacter(partial: PartialCharacter): Character {
  return { ...defaultCharacter, ...partial };
}

const characters: Record<string, Character> = {
  "Li Wei": createCharacter({
    eastworldId: "Li Wei",
    sprite: "li_wei",
    photo: "assets/photos/li_wei.jpeg",
    actions: [
      {
        name: "RunAway",
        startFrame: 1,
        endFrame: 9,
        frameRate: 32,
      },
    ],
  }),
  detective: createCharacter({
    eastworldId: "Detective Samuel O'Connor",
    sprite: "detective",
    photo: "assets/photos/detective.jpeg",
    arrestable: false,
  }),
  "Mei Lin": createCharacter({
    eastworldId: "Mei Lin",
    sprite: "mei_lin",
    photo: "assets/photos/mei_lin.jpeg",
  }),
  "William Harrington": createCharacter({
    eastworldId: "William Harrington",
    sprite: "william_harrington",
    photo: "assets/photos/william_harrington.jpeg",
    actions: [
      {
        name: "Cane",
        startFrame: 1,
        endFrame: 7,
        frameRate: 12,
      },
    ],
  }),
  "Victoria Ashford": createCharacter({
    eastworldId: "Victoria Ashford",
    sprite: "victoria_ashford",
    photo: "assets/photos/victoria_ashford.jpeg",
  }),
  "Amelia Turner": createCharacter({
    eastworldId: "Amelia Turner",
    sprite: "amelia_turner",
    photo: "assets/photos/amelia_turner.jpeg",
  }),
  "Percival Thornton": createCharacter({
    eastworldId: "Percival Thornton",
    sprite: "percival_thornton",
    photo: "assets/photos/percival_thornton.jpeg",
  }),
  "Dr. Eleanor Bennett": createCharacter({
    eastworldId: "Dr. Eleanor Bennett",
    sprite: "eleanor_bennett",
    photo: "assets/photos/eleanor_bennett.jpeg",
  }),
  "Police Chief Locke": createCharacter({
    sprite: "police_officer",
    photo: "assets/photos/police_chief.jpeg",
    interactTopic: Topics.enterArrestModal,
    arrestable: false,
  }),
};

export default characters;
