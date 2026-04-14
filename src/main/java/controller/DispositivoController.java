package controller;

import model.Dispositivo;
import service.DispositivoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/dispositivos")
@CrossOrigin(origins = "*")
public class DispositivoController {

    @Autowired
    private DispositivoService service;

    @GetMapping
    public List<Dispositivo> listar() {
        return service.obterTodos();
    }

    @GetMapping("/consumo")
    public Map<String, Double> getConsumoTotal() {
        double total = service.calcularConsumoTotal(service.obterTodos());
        Map<String, Double> response = new HashMap<>();
        response.put("total", total);
        return response;
    }

    @PostMapping
    public Map<String, Boolean> salvar(@RequestBody Dispositivo dispositivo) {
        boolean sucesso = service.registrar(dispositivo.getNome(), dispositivo.getPotencia(), dispositivo.getTipo());
        Map<String, Boolean> response = new HashMap<>();
        response.put("sucesso", sucesso);
        return response;
    }

    @PutMapping("/{id}/status")
    public Map<String, Object> alterarStatus(@PathVariable int id, @RequestParam boolean status) {
        boolean sucesso = service.alternarStatus(id, status);
        Map<String, Object> response = new HashMap<>();
        response.put("sucesso", sucesso);
        response.put("novoStatus", status);
        return response;
    }

    @DeleteMapping("/{id}")
    public Map<String, Boolean> deletar(@PathVariable int id) {
        boolean sucesso = service.remover(id);
        Map<String, Boolean> response = new HashMap<>();
        response.put("sucesso", sucesso);
        return response;
    }
}