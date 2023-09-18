enum StorageKeys {
  FoundEvidence = "FoundEvidence",
  Notes = "Notes",
  NonInteractableNpcs = "NonInteractable",
  GoneNpcs = "GoneNpcs",
  SessionUuid = "SessionUuid",
}

export type SaveGame = {
  notes: string;
  foundEvidence: Set<string>;
  nonInteractableNpcs: Set<string>;
  goneNpcs: Set<string>;
  sessionUuid: string;
};

// Ah this is probably kind of bad
let gameState: SaveGame = {
  notes: localStorage.getItem(StorageKeys.Notes) || "",
  foundEvidence: new Set(
    JSON.parse(localStorage.getItem(StorageKeys.FoundEvidence) || "[]"),
  ),
  nonInteractableNpcs: new Set(
    JSON.parse(localStorage.getItem(StorageKeys.NonInteractableNpcs) || "[]"),
  ),
  goneNpcs: new Set(
    JSON.parse(localStorage.getItem(StorageKeys.GoneNpcs) || "[]"),
  ),
  sessionUuid: localStorage.getItem(StorageKeys.SessionUuid) || "",
};

export const getGameState = (): SaveGame => gameState;

export const saveGameState = () => {
  localStorage.setItem(StorageKeys.Notes, gameState.notes);
  localStorage.setItem(
    StorageKeys.FoundEvidence,
    JSON.stringify(Array.from(gameState.foundEvidence)),
  );
  localStorage.setItem(
    StorageKeys.NonInteractableNpcs,
    JSON.stringify(Array.from(gameState.nonInteractableNpcs)),
  );
  localStorage.setItem(
    StorageKeys.GoneNpcs,
    JSON.stringify(Array.from(gameState.goneNpcs)),
  );
  localStorage.setItem(StorageKeys.SessionUuid, gameState.sessionUuid);
};

export const resetGameState = () => {
  gameState = {
    notes: "",
    foundEvidence: new Set(),
    nonInteractableNpcs: new Set(),
    goneNpcs: new Set(),
    sessionUuid: "",
  };
  for (const key of Object.values(StorageKeys)) {
    localStorage.removeItem(key);
  }
};

// export default StorageKeys;
