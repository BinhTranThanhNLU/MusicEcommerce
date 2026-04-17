package com.springboot.music.mapper;

import com.springboot.music.dto.UserDTO;
import com.springboot.music.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(source = "role.name", target = "role")
    UserDTO toDto (User user);

}
