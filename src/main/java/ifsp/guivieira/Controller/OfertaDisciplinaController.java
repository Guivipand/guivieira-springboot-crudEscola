package ifsp.guivieira.Controller;

import ifsp.guivieira.Model.Disciplina;
import ifsp.guivieira.Model.OfertaDisciplina;
import ifsp.guivieira.Model.Professor;
import ifsp.guivieira.Repository.DisciplinaRepository;
import ifsp.guivieira.Repository.OfertaDisciplinaRepository;
import ifsp.guivieira.Repository.ProfessorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class OfertaDisciplinaController {

    @Autowired
    private OfertaDisciplinaRepository ofertaDisciplinaRepository;

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @GetMapping("/ofertaDisciplina")
    public String formularioOfertaDisciplina(Model model) {
        model.addAttribute("professores", professorRepository.findAll());
        model.addAttribute("disciplinas", disciplinaRepository.findAll());
        model.addAttribute("oferta", new OfertaDisciplina());
        return "OfertaDisciplina/FormularioOfertaDisciplina.html";
    }

    @PostMapping("/cadastrarOfertaDisciplina")
    public String cadastrarOfertaDisciplina(@RequestParam Integer professorId,
                                            @RequestParam Integer disciplinaId,
                                            @RequestParam String semestre,
                                            @RequestParam String sala) {
        Professor professor = professorRepository.findById(professorId).orElse(null);
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId).orElse(null);
        ofertaDisciplinaRepository.save(new OfertaDisciplina(professor, disciplina, semestre, sala));
        return "redirect:/listarOfertaDisciplina";
    }

    @GetMapping("/listarOfertaDisciplina")
    public String listarOfertaDisciplina(Model model) {
        model.addAttribute("ofertas", ofertaDisciplinaRepository.findAll());
        return "OfertaDisciplina/ListaOfertaDisciplina.html";
    }

    @GetMapping("/ofertaDisciplina/{id}")
    public String show(@PathVariable Integer id, Model model) {
        model.addAttribute("oferta", ofertaDisciplinaRepository.findById(id).orElse(null));
        return "OfertaDisciplina/DetalhesOfertaDisciplina.html";
    }

    @GetMapping("/ofertaDisciplina/{id}/editar")
    public String editarOfertaDisciplina(@PathVariable Integer id, Model model) {
        model.addAttribute("oferta", ofertaDisciplinaRepository.findById(id).orElse(null));
        model.addAttribute("professores", professorRepository.findAll());
        model.addAttribute("disciplinas", disciplinaRepository.findAll());
        return "OfertaDisciplina/FormularioOfertaDisciplina.html";
    }

    @PostMapping("/ofertaDisciplina/{id}/atualizar")
    public String atualizarOfertaDisciplina(@PathVariable Integer id,
                                            @RequestParam Integer professorId,
                                            @RequestParam Integer disciplinaId,
                                            @RequestParam String semestre,
                                            @RequestParam String sala) {
        OfertaDisciplina oferta = ofertaDisciplinaRepository.findById(id).orElse(null);
        if (oferta != null) {
            oferta.setProfessor(professorRepository.findById(professorId).orElse(null));
            oferta.setDisciplina(disciplinaRepository.findById(disciplinaId).orElse(null));
            oferta.setSemestre(semestre);
            oferta.setSala(sala);
            ofertaDisciplinaRepository.save(oferta);
        }
        return "redirect:/listarOfertaDisciplina";
    }

    @GetMapping("/ofertaDisciplina/{id}/deletar")
    public String excluirOfertaDisciplina(@PathVariable Integer id) {
        ofertaDisciplinaRepository.deleteById(id);
        return "redirect:/listarOfertaDisciplina";
    }
}

