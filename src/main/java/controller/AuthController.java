package controller;

import model.Usuario;
import service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UsuarioService service;

    @PostMapping("/register")
    public Map<String, Object> register(@RequestBody Usuario usuario) {
        Map<String, Object> response = new HashMap<>();
        
        if (usuario.getUsuario() == null || usuario.getSenha() == null) {
            response.put("sucesso", false);
            response.put("mensagem", "Dados inválidos.");
            return response;
        }

        boolean sucesso = service.cadastrar(usuario.getUsuario(), usuario.getSenha());

        if (sucesso) {
            response.put("sucesso", true);
            response.put("mensagem", "Usuário criado com sucesso!");
        } else {
            response.put("sucesso", false);
            response.put("mensagem", "Falha ao criar usuário (talvez já exista).");
        }
        return response;
    }

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Usuario credenciais) {
        Map<String, Object> response = new HashMap<>();
        try {
            boolean autenticado = service.login(credenciais.getUsuario(), credenciais.getSenha());
            if (autenticado) {
                response.put("sucesso", true);
                response.put("mensagem", "Login realizado com sucesso!");
                response.put("usuario", credenciais.getUsuario());
            } else {
                response.put("sucesso", false);
                response.put("mensagem", "Usuário ou senha incorretos.");
            }
        } catch (Exception e) {
            response.put("sucesso", false);
            response.put("mensagem", "Erro interno no servidor.");
            e.printStackTrace();
        }
        return response;
    }
    @GetMapping("/ping")
    public Map<String, String> ping() {
    return Map.of("status", "ok");
    }
}