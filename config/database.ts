interface DatabaseConfigInterface {
  url: string;
}

const databaseConfig: DatabaseConfigInterface = {
  url: process.env.MONGODB_URL || 'mongodb+srv://sinproject251201:subhan321@cluster0.rngsv.mongodb.net/book-task4'
};

export default databaseConfig;