package ifsp.guivieira.Controller;

import ifsp.guivieira.Model.Curso;
import ifsp.guivieira.Repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class CursoController {

    @Autowired
    private CursoRepository cursoRepository;

    @GetMapping("/curso")
    public String formularioCurso(Model model) {
        model.addAttribute("curso", new Curso());
        return "Curso/FormularioCurso.html";
    }

    @PostMapping("/cadastrarCurso")
    public String cadastrarCurso(@RequestParam String titulo,
                                 @RequestParam String descricao,
                                 @RequestParam int quantSemestres,
                                 @RequestParam String coordenador) {
        cursoRepository.save(new Curso(titulo, descricao, quantSemestres, coordenador));
        return "redirect:/listarCursos";
    }

    @GetMapping("/listarCursos")
    public String listarCursos(Model model) {
        model.addAttribute("cursos", cursoRepository.findAll());
        return "Curso/ListaCurso.html";
    }

    @GetMapping("/curso/{id}")
    public String show(@PathVariable Integer id, Model model) {
        model.addAttribute("curso", cursoRepository.findById(id).orElse(null));
        return "Curso/DetalhesCurso.html";
    }

    @GetMapping("/curso/{id}/editar")
    public String editarCurso(@PathVariable Integer id, Model model) {
        model.addAttribute("curso", cursoRepository.findById(id).orElse(null));
        return "Curso/FormularioCurso.html";
    }

    @PostMapping("/curso/{id}/atualizar")
    public String atualizarCurso(@PathVariable Integer id,
                                @RequestParam String titulo,
                                @RequestParam String descricao,
                                @RequestParam int quantSemestres,
                                @RequestParam String coordenador) {
        Curso curso = cursoRepository.findById(id).orElse(null);
        if (curso != null) {
            curso.setTitulo(titulo);
            curso.setDescricao(descricao);
            curso.setQuantSemestres(quantSemestres);
            curso.setCoordenador(coordenador);
            cursoRepository.save(curso);
        }
        return "redirect:/listarCursos";
    }

    @GetMapping("/curso/{id}/deletar")
    public String excluirCurso(@PathVariable Integer id) {
        cursoRepository.deleteById(id);
        return "redirect:/listarCursos";
    }
}

