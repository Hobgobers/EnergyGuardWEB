import java.sql.*;

public class TesteConexao {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/energyguard_db?useTimezone=true&serverTimezone=UTC";
        String user = "root";
        String password = "Arkaosbb20032003"; // Substitua pela sua senha real
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("CONEXÃO REALIZADA COM SUCESSO!");
            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SHOW TABLES");
            while (rs.next()) {
                System.out.println("Tabela: " + rs.getString(1));
            }
            conn.close();
        } catch (Exception e) {
            System.out.println("ERRO NA CONEXÃO:");
            e.printStackTrace();
        }
    }
}