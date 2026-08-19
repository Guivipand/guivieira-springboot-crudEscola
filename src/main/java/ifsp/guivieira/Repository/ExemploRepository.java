// package ifsp.guivieira.Repository;

// import java.util.List;
// import org.springframework.stereotype.Repository;
// import jakarta.persistence.EntityManager;
// import jakarta.persistence.PersistenceContext;
// import jakarta.persistence.Query;
// import jakarta.transaction.Transactional;

// @Repository
// public class ExemploRepository {
//     @PersistenceContext
//     private EntityManager em;

//     @Transactional
//     public void save(Pedido pedido) {
//         String sql = "INSERT INTO pedidos (nome, valor, estado, frete) VALUES (:nome, :valor, :estado, :frete)";
//         Query query = em.createNativeQuery(sql);
//         query.setParameter("nome", pedido.getNome());
//         query.setParameter("valor", pedido.getValor());
//         query.setParameter("estado", pedido.getEstado());
//         query.setParameter("frete", pedido.getFrete());
//         query.executeUpdate();
//     }

//     public List<Pedido> findAll() {
//         String sql = "SELECT * FROM pedidos";
//         Query q = em.createNativeQuery(sql, Pedido.class);
//         List<Pedido> pedidos = q.getResultList();
//         return pedidos;
//     }

//     public Pedido findById(int id) {
//         String sql = "SELECT * FROM pedidos WHERE id = :id";
//         Query q = em.createNativeQuery(sql, Pedido.class);
//         q.setParameter("id", id);
//         Pedido pedido = (Pedido) q.getSingleResult();
//         return pedido;
//     }

//     @Transactional
//     public void update(Pedido pedido){
//         String sql = "UPDATE pedidos SET nome = :nome, estado = :estado, valor = :valor, frete = :frete WHERE id = :id";
//         Query query =em.createNativeQuery(sql);
//         query.setParameter("id", pedido.getId());
//         query.setParameter("nome",pedido.getNome());
//         query.setParameter("estado",pedido.getEstado());
//         query.setParameter("valor", pedido.getValor());
//         query.setParameter("frete", pedido.getFrete());
//         query.executeUpdate();
//     }
    
//     @Transactional
//     public void delete(long id){
//         String sql = "DELETE FROM pedidos WHERE id = :id";
//         Query query = em.createNativeQuery(sql);
//         query.setParameter("id", id);
//         query.executeUpdate();
//     }
// }