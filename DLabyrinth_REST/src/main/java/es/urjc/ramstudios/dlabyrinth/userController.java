package es.urjc.ramstudios.dlabyrinth;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/users")
public class userController {
	Map<Long, User> users = new ConcurrentHashMap<>(); 
	AtomicLong nextId = new AtomicLong(0);
	
	
	@GetMapping
	public int numberUsers() {
		return users.size();
	}
	
	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	public long nuevoUser(@RequestBody User user) {

		long id = nextId.incrementAndGet();
		user.setId(id);
		users.put(id, user);

		return user.getId();
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<User> borraUser(@PathVariable long id) {

		User savedUser = users.get(id);

		if (savedUser != null) {
			users.remove(savedUser.getId());
			nextId.set(nextId.get() - 1);
			return new ResponseEntity<>(savedUser, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
		}
	}
}