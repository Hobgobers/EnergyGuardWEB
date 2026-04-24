package service;

import model.Dispositivo;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SugestoesService {

    public double calcularConsumoTotal(List<Dispositivo> dispositivos) {
        return dispositivos.stream()
                .filter(Dispositivo::isLigado)
                .mapToDouble(Dispositivo::getPotencia)
                .sum();
    }

    public List<Dispositivo> sugerirDesligamento(List<Dispositivo> dispositivos, double consumoIdeal) {
        double consumoTotal = calcularConsumoTotal(dispositivos);

        if (consumoTotal <= consumoIdeal) {
            return List.of(); 
        }

        List<Dispositivo> ordenados = dispositivos.stream()
                .filter(Dispositivo::isLigado)
                .sorted((d1, d2) -> Double.compare(d2.getPotencia(), d1.getPotencia())) 
                .collect(Collectors.toList());

        double economiaAcumulada = 0;
        List<Dispositivo> sugestoes = new java.util.ArrayList<>();

        for (Dispositivo d : ordenados) {
            economiaAcumulada += d.getPotencia(); 
            sugestoes.add(d);

            if (consumoTotal - economiaAcumulada <= consumoIdeal) {
                break;
            }
        }

        return sugestoes;
    }

    public double calcularConsumoMedio(List<Dispositivo> dispositivos) {
        if (dispositivos.isEmpty()) {
            return 0;
        }
        double total = dispositivos.stream()
                .mapToDouble(Dispositivo::getPotencia) 
                .sum();

        return total / dispositivos.size();
    }

    public List<Dispositivo> filtrarAcimaDoLimite(List<Dispositivo> dispositivos, double limite) {
        return dispositivos.stream()
                .filter(d -> d.getPotencia() > limite) 
                .collect(Collectors.toList());
    }

    public double calcularEconomiaEmReais(double wattsEconomizados, double precoKwh) {
        double kwh = wattsEconomizados / 1000.0;
        return kwh * precoKwh;
    }
}