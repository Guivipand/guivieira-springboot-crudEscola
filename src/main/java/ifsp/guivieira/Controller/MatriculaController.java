package ifsp.guivieira.Controller;

import ifsp.guivieira.Model.Aluno;
import ifsp.guivieira.Model.Curso;
import ifsp.guivieira.Model.Matricula;
import ifsp.guivieira.Model.OfertaDisciplina;
import ifsp.guivieira.Repository.AlunoRepository;
import ifsp.guivieira.Repository.CursoRepository;
import ifsp.guivieira.Repository.MatriculaRepository;
import ifsp.guivieira.Repository.OfertaDisciplinaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;

@Controller
public class MatriculaController {

    @Autowired
    private MatriculaRepository matriculaRepository;

    @Autowired
    private AlunoRepository alunoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private OfertaDisciplinaRepository ofertaDisciplinaRepository;

    @GetMapping("/matricula")
    public String formularioMatricula(Model model) {
        model.addAttribute("alunos", alunoRepository.findAll());
        model.addAttribute("cursos", cursoRepository.findAll());
        model.addAttribute("ofertas", ofertaDisciplinaRepository.findAll());
        model.addAttribute("matricula", new Matricula());
        return "Matricula/FormularioMatricula.html";
    }

    @PostMapping("/cadastrarMatricula")
    public String cadastrarMatricula(@RequestParam Integer alunoId,
                                     @RequestParam Integer cursoId,
                                     @RequestParam Integer ofertaDisciplinaId,
                                     @RequestParam String dataInicio,
                                     @RequestParam String dataFim,
                                     @RequestParam String situacao) {
        Aluno aluno = alunoRepository.findById(alunoId).orElse(null);
        Curso curso = cursoRepository.findById(cursoId).orElse(null);
        OfertaDisciplina oferta = ofertaDisciplinaRepository.findById(ofertaDisciplinaId).orElse(null);
        LocalDate inicio = dataInicio == null || dataInicio.isEmpty() ? null : LocalDate.parse(dataInicio);
        LocalDate fim = dataFim == null || dataFim.isEmpty() ? null : LocalDate.parse(dataFim);
        matriculaRepository.save(new Matricula(aluno, curso, oferta, inicio, fim, situacao));
        return "redirect:/listarMatriculas";
    }

    @GetMapping("/listarMatriculas")
    public String listarMatriculas(Model model) {
        model.addAttribute("matriculas", matriculaRepository.findAll());
        return "Matricula/ListaMatricula.html";
    }

    @GetMapping("/matricula/{id}")
    public String show(@PathVariable Integer id, Model model) {
        model.addAttribute("matricula", matriculaRepository.findById(id).orElse(null));
        return "Matricula/DetalhesMatricula.html";
    }

    @GetMapping("/matricula/{id}/editar")
    public String editarMatricula(@PathVariable Integer id, Model model) {
        model.addAttribute("matricula", matriculaRepository.findById(id).orElse(null));
        model.addAttribute("alunos", alunoRepository.findAll());
        model.addAttribute("cursos", cursoRepository.findAll());
        model.addAttribute("ofertas", ofertaDisciplinaRepository.findAll());
        return "Matricula/FormularioMatricula.html";
    }

    @PostMapping("/matricula/{id}/atualizar")
    public String atualizarMatricula(@PathVariable Integer id,
                                     @RequestParam Integer alunoId,
                                     @RequestParam Integer cursoId,
                                     @RequestParam Integer ofertaDisciplinaId,
                                     @RequestParam String dataInicio,
                                     @RequestParam String dataFim,
                                     @RequestParam String situacao) {
        Matricula matricula = matriculaRepository.findById(id).orElse(null);
        if (matricula != null) {
            matricula.setAluno(alunoRepository.findById(alunoId).orElse(null));
            matricula.setCurso(cursoRepository.findById(cursoId).orElse(null));
            matricula.setOfertaDisciplina(ofertaDisciplinaRepository.findById(ofertaDisciplinaId).orElse(null));
            matricula.setDataInicio(dataInicio == null || dataInicio.isEmpty() ? null : LocalDate.parse(dataInicio));
            matricula.setDataFim(dataFim == null || dataFim.isEmpty() ? null : LocalDate.parse(dataFim));
            matricula.setSituacao(situacao);
            matriculaRepository.save(matricula);
        }
        return "redirect:/listarMatriculas";
    }

    @GetMapping("/matricula/{id}/deletar")
    public String excluirMatricula(@PathVariable Integer id) {
        matriculaRepository.deleteById(id);
        return "redirect:/listarMatriculas";
    }
}

