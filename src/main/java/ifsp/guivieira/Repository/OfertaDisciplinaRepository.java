package ifsp.guivieira.Repository;

import ifsp.guivieira.Model.OfertaDisciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OfertaDisciplinaRepository extends JpaRepository<OfertaDisciplina, Integer> {
}
