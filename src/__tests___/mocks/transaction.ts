import { LOCK } from "sequelize";

const commit = jest.fn();
const rollback = jest.fn();
const tx = {
  commit,
  rollback,
  afterCommit: () => {},
  LOCK,
};

export const mockTx = { tx, commit, rollback };
