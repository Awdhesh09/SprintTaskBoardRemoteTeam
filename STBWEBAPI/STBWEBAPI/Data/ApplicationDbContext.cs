using Microsoft.Data.SqlClient;

namespace STBWEBAPI.Data
{
    public class ApplicationDbContext
    {
        private readonly string _conn; 
        //Holds the database connection string

        //Constructor: reads "DefaultConnection" from appsettings.json via IConfiguration
        public ApplicationDbContext(IConfiguration config)
        {
            _conn = config.GetConnectionString("DefaultConnection");
        }

        //Method to create and return a new SqlConnection using the stored connection string
        public SqlConnection CreateConnection()
        {
            return new SqlConnection(_conn);
        }
    }
}
