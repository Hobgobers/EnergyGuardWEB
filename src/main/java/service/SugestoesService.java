package service;

import model.Dispositivo;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SugestoesService {

    // Calcula o consumo total SOMENTE dos dispositivos ligados
    public double calcularConsumoTotal(List<Dispositivo> dispositivos) {
        return dispositivos.stream()
                .filter(Dispositivo::isLigado)
                .mapToDouble(Dispositivo::getPotencia) // Alterado de getConsumo para getPotencia
                .sum();
    }

    // Gera sugestões de quais dispositivos desligar para atingir a meta
    public List<Dispositivo> sugerirDesligamento(List<Dispositivo> dispositivos, double consumoIdeal) {
        double consumoTotal = calcularConsumoTotal(dispositivos);

        if (consumoTotal <= consumoIdeal) {
            return List.of(); 
        }

        // Ordena os dispositivos ligados do maior consumo para o menor
        List<Dispositivo> ordenados = dispositivos.stream()
                .filter(Dispositivo::isLigado)
                .sorted((d1, d2) -> Double.compare(d2.getPotencia(), d1.getPotencia())) // Alterado para getPotencia
                .collect(Collectors.toList());

        double economiaAcumulada = 0;
        List<Dispositivo> sugestoes = new java.util.ArrayList<>();

        for (Dispositivo d : ordenados) {
            economiaAcumulada += d.getPotencia(); // Alterado para getPotencia
            sugestoes.add(d);

            // Se ao desligar este dispositivo a meta for atingida, paramos
            if (consumoTotal - economiaAcumulada <= consumoIdeal) {
                break;
            }
        }

        return sugestoes;
    }

    // Calcula a média de potência de TODOS os dispositivos (ligados ou não)
    public double calcularConsumoMedio(List<Dispositivo> dispositivos) {
        if (dispositivos.isEmpty()) {
            return 0;
        }
        double total = dispositivos.stream()
                .mapToDouble(Dispositivo::getPotencia) // Alterado para getPotencia
                .sum();

        return total / dispositivos.size();
    }

    // Filtra dispositivos acima de um limite de potência
    public List<Dispositivo> filtrarAcimaDoLimite(List<Dispositivo> dispositivos, double limite) {
        return dispositivos.stream()
                .filter(d -> d.getPotencia() > limite) // Alterado para getPotencia
                .collect(Collectors.toList());
    }

    // Converte Watts economizados em Reais (baseado no preço do kWh)
    public double calcularEconomiaEmReais(double wattsEconomizados, double precoKwh) {
        double kwh = wattsEconomizados / 1000.0;
        return kwh * precoKwh;
    }
}