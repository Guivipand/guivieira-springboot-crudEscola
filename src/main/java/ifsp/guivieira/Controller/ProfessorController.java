package ifsp.guivieira.Controller;

import ifsp.guivieira.Model.Professor;
import ifsp.guivieira.Repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class ProfessorController {

    @Autowired
    private ProfessorRepository professorRepository;

    @GetMapping("/professor")
    public String formularioProfessor(Model model) {
        model.addAttribute("professor", new Professor());
        return "Professor/FormularioProfessor.html";
    }

    @PostMapping("/cadastrarProfessor")
    public String cadastrarProfessor(@RequestParam String nome,
                                     @RequestParam String email,
                                     @RequestParam String departamento,
                                     @RequestParam String titulacao) {
        professorRepository.save(new Professor(nome, email, departamento, titulacao));
        return "redirect:/listarProfessores";
    }

    @GetMapping("/listarProfessores")
    public String listarProfessores(Model model) {
        model.addAttribute("professores", professorRepository.findAll());
        return "Professor/ListaProfessor.html";
    }

    @GetMapping("/professor/{id}")
    public String show(@PathVariable Integer id, Model model) {
        model.addAttribute("professor", professorRepository.findById(id).orElse(null));
        return "Professor/DetalhesProfessor.html";
    }

    @GetMapping("/professor/{id}/editar")
    public String editarProfessor(@PathVariable Integer id, Model model) {
        model.addAttribute("professor", professorRepository.findById(id).orElse(null));
        return "Professor/FormularioProfessor.html";
    }

    @PostMapping("/professor/{id}/atualizar")
    public String atualizarProfessor(@PathVariable Integer id,
                                     @RequestParam String nome,
                                     @RequestParam String email,
                                     @RequestParam String departamento,
                                     @RequestParam String titulacao) {
        Professor professor = professorRepository.findById(id).orElse(null);
        if (professor != null) {
            professor.setNome(nome);
            professor.setEmail(email);
            professor.setDepartamento(departamento);
            professor.setTitulacao(titulacao);
            professorRepository.save(professor);
        }
        return "redirect:/listarProfessores";
    }

    @GetMapping("/professor/{id}/deletar")
    public String excluirProfessor(@PathVariable Integer id) {
        professorRepository.deleteById(id);
        return "redirect:/listarProfessores";
    }
}

