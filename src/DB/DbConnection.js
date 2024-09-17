import mongoose from "mongoose";

export const DbConnection = async () => {
  try {
    mongoose.connect(process.env.DATABASE_URL);
    const databaseConnection = mongoose.connection;

    databaseConnection.on("connected", () => {
      console.log("Database Connected Successfully");
    });

    databaseConnection.on("error", (error) => {
      console.log("An Error Occured While Connecting to Databse", error);
      process.exit();
    });
  } catch (error) {
    console.log("Something went wrong with DB", error);
  }
};
