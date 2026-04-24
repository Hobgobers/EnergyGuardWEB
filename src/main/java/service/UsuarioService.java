package service;

import dao.UsuarioDAO;
import model.Usuario;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioDAO dao;

    
    @PostConstruct
    public void init() {
    System.out.println("========== " + this.getClass().getSimpleName() + " inicializado ==========");
    dao.criarTabelaSeNaoExistir();
    }

    public boolean cadastrar(String usuario, String senha) {
        return dao.salvar(usuario, senha);
    }

    public boolean login(String usuario, String senha) {
        Usuario u = dao.buscarPorUsuario(usuario);
        if (u != null && u.getSenha().equals(senha)) {
            return true;
        }
        return false;
    }

    public Usuario getUsuario(String usuario) {
        return dao.buscarPorUsuario(usuario);
    }
}