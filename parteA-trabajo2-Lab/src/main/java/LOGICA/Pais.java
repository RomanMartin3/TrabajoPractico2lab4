/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package LOGICA;

/**
 *
 * @author roman
 */
public class Pais {
    
    private int codigoPais;
    private String nombrePais;
    private String capitalPais;
    private String region;
    private String subregion;
    private long poblacion;
    private double latitud;
    private double longitud;

    public Pais(int codigoPais, String nombrePais, String capitalPais, String region, String subregion, long poblacion, double latitud, double longitud) {
        this.codigoPais = codigoPais;
        this.nombrePais = nombrePais;
        this.capitalPais = capitalPais;
        this.region = region;
        this.subregion = subregion;
        this.poblacion = poblacion;
        this.latitud = latitud;
        this.longitud = longitud;
    }

    public int getCodigoPais() {
        return codigoPais;
    }

    public String getNombrePais() {
        return nombrePais;
    }

    public String getCapitalPais() {
        return capitalPais;
    }

    public String getRegion() {
        return region;
    }

    public String getSubregion() {
        return subregion;
    }

    public long getPoblacion() {
        return poblacion;
    }

    public double getLatitud() {
        return latitud;
    }

    public double getLongitud() {
        return longitud;
    }
    
    
    
}
