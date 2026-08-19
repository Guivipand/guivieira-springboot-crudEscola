package ifsp.guivieira.Controller;

import ifsp.guivieira.Model.Aluno;
import ifsp.guivieira.Model.Curso;
import ifsp.guivieira.Repository.AlunoRepository;
import ifsp.guivieira.Repository.CursoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;

@Controller
public class AlunoController {

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @GetMapping("/aluno")
    public String formularioAluno(Model model) {
        model.addAttribute("cursos", cursoRepository.findAll());
        model.addAttribute("aluno", new Aluno());
        return "Aluno/FormularioAluno.html";
    }

    @PostMapping("/cadastrarAluno")
    public String cadastrarAluno(@RequestParam String nome,
                                 @RequestParam String email,
                                 @RequestParam String dataIngresso,
                                 @RequestParam(required = false) Integer cursoId) {
        Curso curso = null;
        if (cursoId != null) {
            curso = cursoRepository.findById(cursoId).orElse(null);
        }
        LocalDate ingresso = dataIngresso == null || dataIngresso.isEmpty() ? null : LocalDate.parse(dataIngresso);
        alunoRepository.save(new Aluno(nome, email, ingresso, curso));
        return "redirect:/listarAlunos";
    }

    @GetMapping("/listarAlunos")
    public String listarAlunos(Model model) {
        model.addAttribute("alunos", alunoRepository.findAll());
        return "Aluno/ListaAluno.html";
    }

    @GetMapping("/aluno/{id}")
    public String show(@PathVariable Integer id, Model model) {
        model.addAttribute("aluno", alunoRepository.findById(id).orElse(null));
        return "Aluno/DetalhesAluno.html";
    }

    @GetMapping("/aluno/{id}/editar")
    public String editarAluno(@PathVariable Integer id, Model model) {
        model.addAttribute("aluno", alunoRepository.findById(id).orElse(null));
        model.addAttribute("cursos", cursoRepository.findAll());
        return "Aluno/FormularioAluno.html";
    }

    @PostMapping("/aluno/{id}/atualizar")
    public String atualizarAluno(@PathVariable Integer id,
                                 @RequestParam String nome,
                                 @RequestParam String email,
                                 @RequestParam String dataIngresso,
                                 @RequestParam(required = false) Integer cursoId) {
        Aluno aluno = alunoRepository.findById(id).orElse(null);
        if (aluno != null) {
            aluno.setNome(nome);
            aluno.setEmail(email);
            aluno.setDataIngresso(dataIngresso == null || dataIngresso.isEmpty() ? null : LocalDate.parse(dataIngresso));
            aluno.setCurso(cursoId == null ? null : cursoRepository.findById(cursoId).orElse(null));
            alunoRepository.save(aluno);
        }
        return "redirect:/listarAlunos";
    }

    @GetMapping("/aluno/{id}/deletar")
    public String excluirAluno(@PathVariable Integer id) {
        alunoRepository.deleteById(id);
        return "redirect:/listarAlunos";
    }
}

