import { Model, DataTypes } from "sequelize";

import db from "../../app/db";

class Task extends Model {
  // @ts-ignore
  id: number;
}

Task.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    done: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize: db, modelName: "tasks" }
);

Task.hasMany(Task, { as: "subTasks", foreignKey: "parentId" });

export default Task;
