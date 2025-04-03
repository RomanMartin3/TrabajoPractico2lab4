package LOGICA;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.sql.*;
import java.util.Optional;
import org.json.JSONArray;
import org.json.JSONObject;

public class main {
    private static final String DB_URL = "jdbc:mysql://localhost:3306/paisesbd";
    private static final String USER = "root";
    private static final String PASSWORD = "mysql";
    private static final String API_URL = "https://restcountries.com/v3.1/alpha/";

    public static void main(String[] args) {
        probarConexion();

        for (int i = 1; i <= 999; i++) {
            String code = String.format("%03d", i);
            obtenerPais(code).ifPresent(pais -> {
                guardarEnBD(pais);
                System.out.println("Guardado país: " + pais.getNombrePais() + " (Código: " + pais.getCodigoPais() + ")");
            });
        }
    }

    public static Optional<Pais> obtenerPais(String code) {
        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(API_URL + code))
                    .GET()
                    .build();

            HttpResponse<String> response = HttpClient.newHttpClient()
                    .send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JSONArray arrayJson = new JSONArray(response.body());
                JSONObject json = arrayJson.getJSONObject(0);

                int codigoPais = Integer.parseInt(json.optString("ccn3", "0"));
                String nombrePais = json.optJSONObject("name").optString("common", "N/A");
                JSONArray capitalArray = json.optJSONArray("capital");
                String capital = (capitalArray != null && capitalArray.length() > 0) ? capitalArray.getString(0) : "N/A";
                String region = json.optString("region", "N/A");
                String subregion = json.optString("subregion", "N/A");
                long poblacion = json.optLong("population", 0);
                JSONArray latlng = json.optJSONArray("latlng");
                double latitud = (latlng != null && latlng.length() > 0) ? latlng.getDouble(0) : 0.0;
                double longitud = (latlng != null && latlng.length() > 1) ? latlng.getDouble(1) : 0.0;

                return Optional.of(new Pais(codigoPais, nombrePais, capital, region, subregion, poblacion, latitud, longitud));
            }

        } catch (Exception e) {
            System.out.println("Error al obtener el país para código: " + code);
        }
        return Optional.empty();
    }

    public static void guardarEnBD(Pais pais) {
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD)) {
            String selectQuery = "SELECT COUNT(*) FROM Pais WHERE codigoPais = ?";
            try (PreparedStatement psSelect = conn.prepareStatement(selectQuery)) {
                psSelect.setInt(1, pais.getCodigoPais());
                ResultSet rs = psSelect.executeQuery();
                rs.next();
                boolean existe = rs.getInt(1) > 0;

                String query = existe
                        ? "UPDATE Pais SET nombrePais=?, capitalPais=?, region=?, subregion=?, poblacion=?, latitud=?, longitud=? WHERE codigoPais=?"
                        : "INSERT INTO Pais (codigoPais, nombrePais, capitalPais, region, subregion, poblacion, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

                try (PreparedStatement ps = conn.prepareStatement(query)) {
                    if (existe) {
                        ps.setString(1, pais.getNombrePais());
                        ps.setString(2, pais.getCapitalPais());
                        ps.setString(3, pais.getRegion());
                        ps.setString(4, pais.getSubregion());
                        ps.setLong(5, pais.getPoblacion());
                        ps.setDouble(6, pais.getLatitud());
                        ps.setDouble(7, pais.getLongitud());
                        ps.setInt(8, pais.getCodigoPais());
                    } else {
                        ps.setInt(1, pais.getCodigoPais());
                        ps.setString(2, pais.getNombrePais());
                        ps.setString(3, pais.getCapitalPais());
                        ps.setString(4, pais.getRegion());
                        ps.setString(5, pais.getSubregion());
                        ps.setLong(6, pais.getPoblacion());
                        ps.setDouble(7, pais.getLatitud());
                        ps.setDouble(8, pais.getLongitud());
                    }
                    ps.executeUpdate();
                }
            }
        } catch (SQLException e) {
            System.out.println("Error al guardar país en BD: " + pais.getCodigoPais());
        }
    }

    public static void probarConexion() {
        try (Connection conn = DriverManager.getConnection(DB_URL, USER, PASSWORD)) {
            if (conn != null) {
                System.out.println("¡Conexión exitosa a la base de datos!");
            } else {
                System.out.println("Fallo en la conexión a la base de datos.");
            }
        } catch (SQLException e) {
            System.out.println("Error al conectar a la base de datos: " + e.getMessage());
        }
    }
}
