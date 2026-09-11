using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using STBWEBAPI.DTOs;
using STBWEBAPI.Services.Interface;

namespace STBWEBAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly ITaskService _service;
        private readonly ILogger<TasksController> _logger;

        public TasksController(ITaskService service, ILogger<TasksController> logger)
        {
            _service = service;
            _logger = logger;
        }

        //Get all tasks with pagination
        [HttpGet]
        public async Task<IActionResult> GetAll([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            try
            {
                // Service call to fetch paginated tasks
                var result = await _service.GetAllTasksAsync(pageNumber, pageSize);
                return Ok(result); // 200 OK response
            }
            catch (ArgumentException ex)
            {
                // Handle invalid arguments (e.g., negative page number)
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                // Log unexpected errors and return 500
                _logger.LogError(ex, "Error in GetAll");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal Server Error" });
            }
        }

        // Get task by Id
        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            try
            {
                var task = await _service.GetTaskByIdAsync(id);
                if (task == null)
                    return NotFound(new { message = $"Task with id {id} not found." }); // 404 Not Found

                return Ok(task); // 200 OK
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetById");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal Server Error" });
            }
        }

        // Create new task
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CreateTaskDto dto)
        {
            try
            {
                var result = await _service.CreateTaskAsync(dto);
                // 201 Created response with location header
                return CreatedAtAction(nameof(GetById), new { id = result.Id }, result);
            }
            catch (ArgumentException ex)
            {
                // Handle validation errors
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Create");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal Server Error" });
            }
        }

        //Update existing task
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] UpdateTaskDto dto)
        {
            try
            {
                if (id != dto.Id)
                    return BadRequest(new { message = "Id mismatch" }); // 400 Bad Request

                var result = await _service.UpdateTaskAsync(dto);
                if (result == null)
                    return NotFound(new { message = $"Task with id {id} not found." }); // 404 Not Found

                return Ok(result); // 200 OK
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Update");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal Server Error" });
            }
        }

        // Delete task by Id
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var deleted = await _service.DeleteTaskAsync(id);
                if (!deleted)
                    return NotFound(new { message = $"Task with id {id} not found." }); // 404 Not Found

                return NoContent(); // 204 No Content
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in Delete");
                return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Internal Server Error" });
            }
        }
    }


}
