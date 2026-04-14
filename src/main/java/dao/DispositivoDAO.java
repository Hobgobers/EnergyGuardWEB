package dao;

import model.Dispositivo;
import org.springframework.stereotype.Repository;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Repository
public class DispositivoDAO {

    private static final String URL = "jdbc:mysql://localhost:3306/energyguard_db?useTimezone=true&serverTimezone=UTC";
    private static final String USER = "root";
    private static final String PASSWORD = "Arkaosbb20032003";

    private Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            return DriverManager.getConnection(URL, USER, PASSWORD);
        } catch (ClassNotFoundException e) {
            throw new SQLException("Driver MySQL não encontrado!", e);
        }
    }

    public void criarTabelaSeNaoExistir() {
        String sql = "CREATE TABLE IF NOT EXISTS dispositivos (" +
            "id INT AUTO_INCREMENT PRIMARY KEY, " +
            "nome VARCHAR(100), " +
            "potencia DOUBLE, " +
            "ligado BOOLEAN, " +
            "tipo VARCHAR(50))";
        try (Connection conn = getConnection(); Statement stmt = conn.createStatement()) {
            stmt.execute(sql);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public List<Dispositivo> listarTodos() {
        List<Dispositivo> lista = new ArrayList<>();
        String sql = "SELECT * FROM dispositivos";
        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {
            while (rs.next()) {
                Dispositivo d = new Dispositivo();
                d.setId(rs.getInt("id"));
                d.setNome(rs.getString("nome"));
                d.setPotencia(rs.getDouble("potencia"));
                d.setLigado(rs.getBoolean("ligado"));
                d.setTipo(rs.getString("tipo"));
                lista.add(d);
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return lista;
    }

    public boolean salvar(Dispositivo d) {
        String sql = "INSERT INTO dispositivos (nome, potencia, ligado, tipo) VALUES (?, ?, ?, ?)";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setString(1, d.getNome());
            stmt.setDouble(2, d.getPotencia());
            stmt.setBoolean(3, d.isLigado());
            stmt.setString(4, d.getTipo());
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean atualizarStatus(int id, boolean status) {
        String sql = "UPDATE dispositivos SET ligado = ? WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setBoolean(1, status);
            stmt.setInt(2, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean deletar(int id) {
        String sql = "DELETE FROM dispositivos WHERE id = ?";
        try (Connection conn = getConnection(); PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, id);
            return stmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }
}