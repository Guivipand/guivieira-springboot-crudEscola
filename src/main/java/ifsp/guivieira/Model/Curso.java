package ifsp.guivieira.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "cursos")
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "titulo")
    private String titulo;

    @Column(name = "descricao")
    private String descricao;

    @Column(name = "quant_semestres")
    private int quantSemestres;

    @Column(name = "coordenador")
    private String coordenador;

    public Curso() {
    }

    public Curso(String titulo, String descricao, int quantSemestres, String coordenador) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.quantSemestres = quantSemestres;
        this.coordenador = coordenador;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public int getQuantSemestres() {
        return quantSemestres;
    }

    public void setQuantSemestres(int quantSemestres) {
        this.quantSemestres = quantSemestres;
    }

    public String getCoordenador() {
        return coordenador;
    }

    public void setCoordenador(String coordenador) {
        this.coordenador = coordenador;
    }
}
