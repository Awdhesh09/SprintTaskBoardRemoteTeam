using AutoMapper;
using STBWEBAPI.DTOs;
using STBWEBAPI.Models;

namespace STBWEBAPI.AutoMappers
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CreateTaskDto, TaskItem>();
            CreateMap<UpdateTaskDto, TaskItem>();
            CreateMap<TaskItem, CreateTaskDto>();
            CreateMap<TaskItem, UpdateTaskDto>();
        }
    }
}