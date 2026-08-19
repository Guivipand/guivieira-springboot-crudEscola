package ifsp.guivieira.Controller;

import ifsp.guivieira.Model.Aluno;
import ifsp.guivieira.Model.Disciplina;
import ifsp.guivieira.Repository.DisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class DisciplinaController {

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @GetMapping("/disciplina")
    public String formularioDisciplina(Model model) {
        model.addAttribute("disciplina", new Disciplina());
        return "Disciplina/FormularioDisciplina.html";
    }

    @PostMapping("/cadastrarDisciplina")
    public String cadastrarDisciplina(@RequestParam String codigo,
                                      @RequestParam String nome,
                                      @RequestParam String descricao,
                                      @RequestParam int cargaHoraria) {
        disciplinaRepository.save(new Disciplina(codigo, nome, descricao, cargaHoraria));
        return "redirect:/listarDisciplinas";
    }

    @GetMapping("/listarDisciplinas")
    public String listarDisciplinas(Model model) {
        model.addAttribute("disciplinas", disciplinaRepository.findAll());
        return "Disciplina/ListaDisciplina.html";
    }

    @GetMapping("/disciplina/{id}")
    public String show(@PathVariable Integer id, Model model) {
        model.addAttribute("disciplina", disciplinaRepository.findById(id).orElse(null));
        return "Disciplina/DetalhesDisciplina.html";
    }

    @GetMapping("/disciplina/{id}/editar")
    public String editarDisciplina(@PathVariable Integer id, Model model) {
        model.addAttribute("disciplina", disciplinaRepository.findById(id).orElse(null));
        return "Disciplina/FormularioDisciplina.html";
    }

    @PostMapping("/disciplina/{id}/atualizar")
    public String atualizarDisciplina(@PathVariable Integer id,
                                      @RequestParam String codigo,
                                      @RequestParam String nome,
                                      @RequestParam String descricao,
                                      @RequestParam int cargaHoraria) {
        Disciplina disciplina = disciplinaRepository.findById(id).orElse(null);
        if (disciplina != null) {
            disciplina.setCodigo(codigo);
            disciplina.setNome(nome);
            disciplina.setDescricao(descricao);
            disciplina.setCargaHoraria(cargaHoraria);
            disciplinaRepository.save(disciplina);
        }
        return "redirect:/listarDisciplinas";
    }

    @GetMapping("/disciplina/{id}/deletar")
    public String excluirDisciplina(@PathVariable Integer id) {
        disciplinaRepository.deleteById(id);
        return "redirect:/listarDisciplinas";
    }
}

