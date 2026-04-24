package service;

import dao.DispositivoDAO;
import model.Dispositivo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.List;

@Service
public class DispositivoService {

    @Autowired
    private DispositivoDAO dao;

    
    @PostConstruct
    public void init() {
    System.out.println("========== " + this.getClass().getSimpleName() + " inicializado ==========");
    dao.criarTabelaSeNaoExistir();
    }

    public List<Dispositivo> obterTodos() {
        return dao.listarTodos();
    }

    public boolean registrar(String nome, double potencia, String tipo) {
        Dispositivo d = new Dispositivo(nome, potencia, false);
        d.setTipo(tipo);
        return dao.salvar(d);
    }

    public boolean alternarStatus(int id, boolean status) {
        return dao.atualizarStatus(id, status);
    }

    public boolean remover(int id) {
        return dao.deletar(id);
    }

    public double calcularConsumoTotal(List<Dispositivo> lista) {
        return lista.stream()
                .filter(Dispositivo::isLigado)
                .mapToDouble(Dispositivo::getPotencia)
                .sum();
    }
}