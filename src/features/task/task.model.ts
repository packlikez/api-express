import { Model, DataTypes } from "sequelize";

import db from "../../app/db";

class Task extends Model {}

Task.init(
  {
    title: DataTypes.STRING,
    done: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  { sequelize: db, modelName: "tasks" }
);

Task.hasMany(Task, { as: "subTasks", foreignKey: "parentId" });

export default Task;
