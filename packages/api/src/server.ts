import { App } from '@/app';
import { AuthRoute } from '@routes/auth.route';
import { TodoRoute } from '@routes/todos.route';
import { UserRoute } from '@routes/users.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new AuthRoute(), new UserRoute(), new TodoRoute()]);

app.listen();
