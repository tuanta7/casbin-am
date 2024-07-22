package utils

import (
	"fmt"
	"strings"
)

func DisplayNameToSystemName(DisplayName string, Prefix ...string) string {
	name := strings.ReplaceAll(strings.ToLower(DisplayName), " ", "_")
	if len(Prefix) > 0 {
		name = fmt.Sprintf("%s:%s", Prefix[0], name)
	}
	return name
}
