package controller;

import model.Dispositivo;
import service.DispositivoService;
import service.SugestoesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/sugestoes")
@CrossOrigin(origins = "*")
public class SugestoesController {

    @Autowired
    private SugestoesService service;

    @Autowired
    private DispositivoService dispositivoService; 


    @PostMapping("/analisar")
    public Map<String, Object> analisar(@RequestBody Map<String, Double> payload) {
        double consumoIdeal = payload.getOrDefault("consumoIdeal", 0.0);
        
        List<Dispositivo> todosDispositivos = dispositivoService.obterTodos();
        
        double consumoAtual = service.calcularConsumoTotal(todosDispositivos);
        List<Dispositivo> sugestoes = service.sugerirDesligamento(todosDispositivos, consumoIdeal);

        Map<String, Object> response = new HashMap<>();
        response.put("consumoAtual", consumoAtual);
        response.put("consumoIdeal", consumoIdeal);
        response.put("precisaReduzir", consumoAtual > consumoIdeal);
        response.put("sugestoes", sugestoes);
        
        return response;
    }

    // Endpoint para obter estatísticas (Média e Total)
    // GET: http://localhost:8080/EnergyGuard_FINAL/api/sugestoes/estatisticas
    @GetMapping("/estatisticas")
    public Map<String, Double> getEstatisticas() {
        List<Dispositivo> todosDispositivos = dispositivoService.obterTodos();
        
        Map<String, Double> response = new HashMap<>();
        response.put("media", service.calcularConsumoMedio(todosDispositivos));
        response.put("totalLigado", service.calcularConsumoTotal(todosDispositivos));
        
        return response;
    }

    // Endpoint para filtrar dispositivos acima de um limite
    // POST: http://localhost:8080/EnergyGuard_FINAL/api/sugestoes/filtrar
    // Body JSON: { "limite": 100.0 }
    @PostMapping("/filtrar")
    public List<Dispositivo> filtrarAcimaDoLimite(@RequestBody Map<String, Double> payload) {
        double limite = payload.getOrDefault("limite", 0.0);
        List<Dispositivo> todosDispositivos = dispositivoService.obterTodos();
        return service.filtrarAcimaDoLimite(todosDispositivos, limite);
    }

    // Endpoint para calcular economia financeira
    // POST: http://localhost:8080/EnergyGuard_FINAL/api/sugestoes/economia
    // Body JSON: { "watts": 500, "precoKwh": 0.80 }
    @PostMapping("/economia")
    public Map<String, Double> calcularEconomia(@RequestBody Map<String, Double> payload) {
        double watts = payload.getOrDefault("watts", 0.0);
        double precoKwh = payload.getOrDefault("precoKwh", 0.0);
        
        double valorEconomia = service.calcularEconomiaEmReais(watts, precoKwh);
        
        Map<String, Double> response = new HashMap<>();
        response.put("economiaReais", valorEconomia);
        
        return response;
    }
}