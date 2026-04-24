package model;

public class Dispositivo {
    private int id;
    private String nome;
    private double potencia; 
    private boolean ligado;
    private String tipo;

    public Dispositivo() {} 

    public Dispositivo(String nome, double potencia, boolean ligado) {
        this.nome = nome;
        this.potencia = potencia;
        this.ligado = ligado;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public double getPotencia() { return potencia; }
    public void setPotencia(double potencia) { this.potencia = potencia; }
    
    public boolean isLigado() { return ligado; }
    public void setLigado(boolean ligado) { this.ligado = ligado; }
    
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
}